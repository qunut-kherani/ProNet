import { useState } from "react";
import { db, auth } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import { useToast } from "../components/Toast";
import { FiSearch, FiMapPin, FiBriefcase, FiFilter } from "react-icons/fi";

const JOBS = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp India",
    location: "Bangalore, IN",
    type: "Full-time",
    salary: "₹12–18 LPA",
    posted: "2d ago",
    logo: "💻",
    skills: ["React", "CSS", "JavaScript", "TypeScript"],
    description: "Build and maintain high-quality web applications using React.js and modern frontend technologies.",
  },
  {
    id: 2,
    title: "Data Analyst Intern",
    company: "DataViz Inc.",
    location: "Remote",
    type: "Internship",
    salary: "₹25K/month",
    posted: "3d ago",
    logo: "📊",
    skills: ["Python", "Excel", "SQL", "Tableau"],
    description: "Analyze large datasets and create insightful visualizations to help drive business decisions.",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "DesignHub",
    location: "Mumbai, IN",
    type: "Full-time",
    salary: "₹10–15 LPA",
    posted: "1d ago",
    logo: "🎨",
    skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
    description: "Design beautiful and intuitive user interfaces for web and mobile applications.",
  },
  {
    id: 4,
    title: "Backend Developer",
    company: "CloudBase Tech",
    location: "Hyderabad, IN",
    type: "Full-time",
    salary: "₹15–22 LPA",
    posted: "5d ago",
    logo: "⚙️",
    skills: ["Node.js", "Firebase", "MongoDB", "AWS"],
    description: "Design and build scalable backend systems and RESTful APIs for our cloud platform.",
  },
  {
    id: 5,
    title: "ML Engineer Intern",
    company: "AI Labs",
    location: "Remote",
    type: "Internship",
    salary: "₹30K/month",
    posted: "1d ago",
    logo: "🤖",
    skills: ["Python", "TensorFlow", "PyTorch", "Scikit-learn"],
    description: "Work on cutting-edge machine learning models and contribute to real AI products.",
  },
  {
    id: 6,
    title: "DevOps Engineer",
    company: "ScaleUp Systems",
    location: "Pune, IN",
    type: "Full-time",
    salary: "₹18–28 LPA",
    posted: "3d ago",
    logo: "🔧",
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
    description: "Manage and improve our cloud infrastructure, deployment pipelines, and monitoring systems.",
  },
  {
    id: 7,
    title: "Product Manager",
    company: "Growfast Startup",
    location: "Delhi, IN",
    type: "Full-time",
    salary: "₹20–30 LPA",
    posted: "2d ago",
    logo: "📱",
    skills: ["Product Strategy", "Agile", "Data Analysis", "Roadmap"],
    description: "Define product vision, strategy, and roadmap for our B2B SaaS platform.",
  },
  {
    id: 8,
    title: "Android Developer",
    company: "MobileFirst Co.",
    location: "Chennai, IN",
    type: "Full-time",
    salary: "₹12–20 LPA",
    posted: "4d ago",
    logo: "📲",
    skills: ["Kotlin", "Java", "Android SDK", "Firebase"],
    description: "Build and maintain high-performance Android applications with millions of users.",
  },
  {
    id: 9,
    title: "Cybersecurity Analyst",
    company: "SecureNet",
    location: "Bangalore, IN",
    type: "Full-time",
    salary: "₹15–25 LPA",
    posted: "6d ago",
    logo: "🔐",
    skills: ["Penetration Testing", "CISSP", "Networking", "Python"],
    description: "Protect our systems and networks from cyber threats through proactive security measures.",
  },
  {
    id: 10,
    title: "Full Stack Developer",
    company: "Unicorn Tech",
    location: "Remote",
    type: "Full-time",
    salary: "₹16–24 LPA",
    posted: "1d ago",
    logo: "🦄",
    skills: ["React", "Node.js", "MongoDB", "GraphQL"],
    description: "Build end-to-end features for our fast-growing product used by 500K+ users.",
  },
  {
    id: 11,
    title: "iOS Developer",
    company: "AppCraft Studios",
    location: "Bangalore, IN",
    type: "Full-time",
    salary: "₹14–22 LPA",
    posted: "2d ago",
    logo: "🍎",
    skills: ["Swift", "SwiftUI", "Xcode", "CoreData"],
    description: "Design and build iOS applications with beautiful UI and smooth performance.",
  },
  {
    id: 12,
    title: "Data Science Intern",
    company: "Analytics Pro",
    location: "Remote",
    type: "Internship",
    salary: "₹20K/month",
    posted: "1d ago",
    logo: "🔬",
    skills: ["Python", "Pandas", "NumPy", "Matplotlib"],
    description: "Work on real data science projects and gain hands-on experience with industry datasets.",
  },
];

const FILTERS = ["All", "Full-time", "Internship", "Remote"];

export default function Jobs() {
  const [applied, setApplied] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("");
  const user = auth.currentUser;
  const toast = useToast();

  const handleApply = async job => {
    try {
      await addDoc(collection(db, "applications"), {
        userId: user.uid,
        userEmail: user.email,
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        appliedAt: serverTimestamp(),
      });
      setApplied(prev => [...prev, job.id]);
    } catch (err) {
      toast("Error applying. Try again.", "error");
    }
  };

  const filtered = JOBS.filter(j => {
    const matchSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchType =
      filter === "All" ||
      j.type === filter ||
      (filter === "Remote" && j.location === "Remote");
    const matchLocation =
      !locationFilter.trim() ||
      j.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchSearch && matchType && matchLocation;
  });

  return (
    <>
      <Navbar />
      <div className="jobs-page">
        <div className="jobs-header">
          <h2>Find Your Next Opportunity</h2>
          <p style={{ color: "var(--muted)", marginTop: 4 }}>
            {JOBS.length} jobs available · {applied.length} applied
          </p>
        </div>

        <div style={{
          background: "var(--white)",
          border: "1.5px solid var(--border)",
          borderRadius: 12,
          padding: "1rem 1.2rem",
          marginBottom: "1.5rem",
          boxShadow: "var(--shadow)",
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}>
          <div style={{ position: "relative", flex: 2, minWidth: 200 }}>
            <FiSearch style={{
              position: "absolute", left: 12, top: "50%",
              transform: "translateY(-50%)", color: "var(--muted)",
            }} />
            <input
              placeholder="Search jobs, companies, skills..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 36, borderRadius: 24 }}
            />
          </div>

          <div style={{ position: "relative", flex: 1, minWidth: 150 }}>
            <FiMapPin style={{
              position: "absolute", left: 12, top: "50%",
              transform: "translateY(-50%)", color: "var(--muted)",
            }} />
            <input
              placeholder="Location..."
              value={locationFilter}
              onChange={e => setLocationFilter(e.target.value)}
              style={{ paddingLeft: 36, borderRadius: 24 }}
            />
          </div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={filter === f ? "btn-primary" : "btn-ghost"}
                style={{ padding: "9px 16px", borderRadius: 20, fontSize: 13 }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "3rem",
            color: "var(--muted)",
            background: "var(--white)",
            borderRadius: 12,
            border: "1.5px solid var(--border)",
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
              No jobs found
            </div>
            <div style={{ fontSize: 13 }}>
              Try adjusting your search or filters.
            </div>
          </div>
        ) : (
          <div className="jobs-list">
            <p style={{
              fontSize: 13, color: "var(--muted)",
              marginBottom: 12, fontWeight: 600,
            }}>
              Showing {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </p>
            {filtered.map(job => (
              <JobCard
                key={job.id}
                job={job}
                applied={applied.includes(job.id)}
                onApply={handleApply}
                toast={toast}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}