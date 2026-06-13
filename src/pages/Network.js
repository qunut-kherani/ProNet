import { useState, useEffect } from "react";
import {
  collection, getDocs, doc, updateDoc,
  arrayUnion, arrayRemove, getDoc
} from "firebase/firestore";
import { db, auth } from "../firebase";
import Navbar from "../components/Navbar";
import ConnectionCard from "../components/ConnectionCard";
import { useToast } from "../components/Toast";
import { FiUsers, FiSearch } from "react-icons/fi";

const MOCK_USERS = [
  { uid:"m1",  name:"Priya Sharma",    headline:"Software Engineer @ Google",          location:"Bangalore",  mutual:12, color:"#7C3AED" },
  { uid:"m2",  name:"Rahul Mehta",     headline:"Full Stack Developer | React & Node", location:"Mumbai",     mutual:8,  color:"#2563EB" },
  { uid:"m3",  name:"Ananya Iyer",     headline:"Data Scientist | AI/ML Researcher",   location:"Hyderabad",  mutual:15, color:"#059669" },
  { uid:"m4",  name:"Vikram Singh",    headline:"Product Manager @ Flipkart",          location:"Delhi",      mutual:6,  color:"#D97706" },
  { uid:"m5",  name:"Sneha Kulkarni", headline:"UX Designer | Design Thinking Coach", location:"Pune",       mutual:9,  color:"#DB2777" },
  { uid:"m6",  name:"Arjun Patel",    headline:"Cloud Architect @ AWS | DevOps",      location:"Chennai",    mutual:11, color:"#0891B2" },
  { uid:"m7",  name:"Meera Joshi",    headline:"Startup Founder | EdTech",            location:"Bangalore",  mutual:7,  color:"#7C3AED" },
  { uid:"m8",  name:"Karan Malhotra", headline:"Cybersecurity Expert | CISSP",        location:"Mumbai",     mutual:4,  color:"#DC2626" },
  { uid:"m9",  name:"Divya Nair",     headline:"HR Director | Talent Acquisition",    location:"Delhi",      mutual:18, color:"#059669" },
  { uid:"m10", name:"Rohit Bansal",   headline:"Android Developer @ Zomato",          location:"Gurgaon",    mutual:5,  color:"#2563EB" },
  { uid:"m11", name:"Kavitha Reddy",  headline:"Blockchain Developer | Web3",         location:"Hyderabad",  mutual:3,  color:"#7C3AED" },
  { uid:"m12", name:"Amit Sharma",    headline:"Engineering Manager @ Microsoft",     location:"Bangalore",  mutual:22, color:"#0891B2" },
  { uid:"m13", name:"Pooja Krishnan", headline:"Marketing Lead | Growth Hacker",      location:"Mumbai",     mutual:14, color:"#DB2777" },
  { uid:"m14", name:"Suresh Nambiar", headline:"iOS Developer | Swift Expert",        location:"Kochi",      mutual:6,  color:"#D97706" },
  { uid:"m15", name:"Nisha Agarwal",  headline:"Data Engineer @ Netflix",             location:"Bangalore",  mutual:10, color:"#DC2626" },
  { uid:"m16", name:"Deepak Verma",   headline:"DevOps Engineer | Kubernetes Expert", location:"Noida",      mutual:7,  color:"#0891B2" },
  { uid:"m17", name:"Swati Gupta",    headline:"Business Analyst | Agile Coach",      location:"Pune",       mutual:9,  color:"#DB2777" },
  { uid:"m18", name:"Nikhil Jain",    headline:"React Native Developer | Mobile",     location:"Jaipur",     mutual:5,  color:"#2563EB" },
  { uid:"m19", name:"Ritu Patel",     headline:"Product Designer @ Swiggy",           location:"Bangalore",  mutual:13, color:"#7C3AED" },
  { uid:"m20", name:"Mohit Agarwal",  headline:"Backend Engineer | Golang",           location:"Hyderabad",  mutual:8,  color:"#059669" },
  { uid:"m21", name:"Lakshmi Iyer",   headline:"QA Engineer | Test Automation",       location:"Chennai",    mutual:4,  color:"#D97706" },
  { uid:"m22", name:"Rajesh Kumar",   headline:"Tech Lead @ Infosys | Java Expert",   location:"Mysore",     mutual:11, color:"#DC2626" },
  { uid:"m23", name:"Aarti Singh",    headline:"Content Strategist | SEO & Growth",   location:"Delhi",      mutual:6,  color:"#DB2777" },
  { uid:"m24", name:"Sanjay Rao",     headline:"Embedded Systems Engineer | IoT",     location:"Bangalore",  mutual:3,  color:"#0891B2" },
  { uid:"m25", name:"Preethi Nair",   headline:"Cloud Security Analyst | GCP",        location:"Kochi",      mutual:9,  color:"#059669" },
  { uid:"m26", name:"Varun Malhotra", headline:"Scrum Master | Project Management",   location:"Mumbai",     mutual:16, color:"#D97706" },
  { uid:"m27", name:"Harini Bala",    headline:"Flutter Developer | Cross-Platform",  location:"Coimbatore", mutual:5,  color:"#2563EB" },
  { uid:"m28", name:"Tarun Saxena",   headline:"AI Product Manager | LLMs & GenAI",   location:"Bangalore",  mutual:19, color:"#7C3AED" },
];

export default function Network() {
  const [myData, setMyData] = useState(null);
  const [realUsers, setRealUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("suggestions");
  const [search, setSearch] = useState("");
  const currentUser = auth.currentUser;
  const toast = useToast();

  useEffect(() => {
    if (!currentUser) return;
    const fetchData = async () => {
      const mySnap = await getDoc(doc(db, "users", currentUser.uid));
      if (mySnap.exists()) setMyData(mySnap.data());
      const snap = await getDocs(collection(db, "users"));
      setRealUsers(
        snap.docs
          .map(d => ({ ...d.data(), uid: d.id }))
          .filter(u => u.uid !== currentUser.uid)
      );
    };
    fetchData();
  }, [currentUser]);

  const connections = myData?.connections || [];
  const requests = myData?.connectionRequests || [];

  const allUsers = [
    ...realUsers,
    ...MOCK_USERS.filter(m => !realUsers.find(r => r.uid === m.uid)),
  ];

  const getStatus = uid => {
    if (connections.includes(uid)) return "connected";
    if (requests.includes(uid)) return "received";
    return "none";
  };

  const handleConnect = async uid => {
    await updateDoc(doc(db, "users", currentUser.uid), {
      connections: arrayUnion(uid),
    });
    setMyData(p => ({
      ...p,
      connections: [...(p.connections || []), uid],
    }));
  };

  const handleAccept = async uid => {
    await updateDoc(doc(db, "users", currentUser.uid), {
      connections: arrayUnion(uid),
      connectionRequests: arrayRemove(uid),
    });
    setMyData(p => ({
      ...p,
      connections: [...(p.connections || []), uid],
      connectionRequests: (p.connectionRequests || []).filter(id => id !== uid),
    }));
  };

  const handleReject = async uid => {
    await updateDoc(doc(db, "users", currentUser.uid), {
      connectionRequests: arrayRemove(uid),
    });
    setMyData(p => ({
      ...p,
      connectionRequests: (p.connectionRequests || []).filter(id => id !== uid),
    }));
  };

  const handleRemove = async uid => {
    await updateDoc(doc(db, "users", currentUser.uid), {
      connections: arrayRemove(uid),
    });
    setMyData(p => ({
      ...p,
      connections: (p.connections || []).filter(id => id !== uid),
    }));
  };

  const suggestions = allUsers.filter(u => getStatus(u.uid) === "none");
  const connectedUsers = allUsers.filter(u => getStatus(u.uid) === "connected");
  const requestUsers = allUsers.filter(u => getStatus(u.uid) === "received");

  const displayUsers = (
    activeTab === "suggestions" ? suggestions :
    activeTab === "connections" ? connectedUsers :
    requestUsers
  ).filter(u =>
    !search.trim() ||
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.headline?.toLowerCase().includes(search.toLowerCase()) ||
    u.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="network-page">
        <div className="network-header">
          <h2>
            <FiUsers style={{ marginRight: 8, verticalAlign: "middle" }} />
            My Network
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 4 }}>
            {connections.length} connections · {suggestions.length} suggestions
          </p>
        </div>

        <div style={{
          display: "flex", gap: 12, marginBottom: "1.5rem",
          flexWrap: "wrap", alignItems: "center",
        }}>
          <div className="network-tabs">
            <button
              className={`network-tab ${activeTab === "suggestions" ? "active" : ""}`}
              onClick={() => setActiveTab("suggestions")}
            >
              Suggestions ({suggestions.length})
            </button>
            <button
              className={`network-tab ${activeTab === "connections" ? "active" : ""}`}
              onClick={() => setActiveTab("connections")}
            >
              Connections ({connectedUsers.length})
            </button>
            <button
              className={`network-tab ${activeTab === "requests" ? "active" : ""}`}
              onClick={() => setActiveTab("requests")}
            >
              Requests ({requestUsers.length})
            </button>
          </div>

          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <FiSearch style={{
              position: "absolute", left: 12, top: "50%",
              transform: "translateY(-50%)", color: "var(--muted)",
            }} />
            <input
              placeholder="Search people..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 36, borderRadius: 24 }}
            />
          </div>
        </div>

        {displayUsers.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "3rem",
            color: "var(--muted)",
            background: "var(--white)",
            borderRadius: 12,
            border: "1.5px solid var(--border)",
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>
              {activeTab === "connections" ? "🤝" :
               activeTab === "requests" ? "📬" : "👥"}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
              {activeTab === "connections" ? "No connections yet" :
               activeTab === "requests" ? "No pending requests" :
               "No results found"}
            </div>
            <div style={{ fontSize: 13 }}>
              {activeTab === "connections"
                ? "Start connecting with professionals!"
                : activeTab === "requests"
                ? "When someone sends you a request it will appear here."
                : "Try a different search term."}
            </div>
          </div>
        ) : (
          <div className="network-grid">
            {displayUsers.map(u => (
              <ConnectionCard
                key={u.uid}
                user={u}
                status={getStatus(u.uid)}
                onConnect={handleConnect}
                onAccept={handleAccept}
                onReject={handleReject}
                onRemove={handleRemove}
                toast={toast}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}