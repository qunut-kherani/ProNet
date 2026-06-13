import { useState, useEffect } from "react";
import {
  collection, addDoc, onSnapshot, updateDoc,
  doc, orderBy, query, serverTimestamp, limit
} from "firebase/firestore";
import { db, auth } from "../firebase";
import PostCard from "./PostCard";
import { useToast } from "./Toast";
import { FiImage, FiVideo, FiCalendar, FiX } from "react-icons/fi";

const SEED_POSTS = [
  { id:"s1", authorName:"Priya Sharma", authorTitle:"Software Engineer @ Google", avatar:"PS", text:"Thrilled to announce that I've officially joined Google as a Software Engineer! 🎉 The journey wasn't easy — 6 months of grinding LeetCode, system design, and mock interviews. But every late night was worth it.\n\nTo everyone still in the process: keep going. Your breakthrough is closer than you think. 💪\n\n#Google #SoftwareEngineer #NewJob #Grateful", likes:["u1","u2","u3","u4","u5","u6","u7","u8","u9","u10"], comments:47, shares:23, time:"2h", color:"#7C3AED" },
  { id:"s2", authorName:"Rahul Mehta", authorTitle:"Full Stack Developer | React & Node.js", avatar:"RM", text:"🚀 Hot take: The best developers aren't the ones who know every framework — they're the ones who know HOW to learn.\n\nI've switched tech stacks 3 times in 4 years:\n✅ PHP → Node.js\n✅ jQuery → React\n✅ REST → GraphQL\n\nEvery transition made me stronger. Don't fear change. Embrace it.\n\n#WebDev #JavaScript #React #CareerAdvice", likes:["u1","u2","u3","u4","u5"], comments:89, shares:156, time:"4h", color:"#2563EB" },
  { id:"s3", authorName:"Ananya Iyer", authorTitle:"Data Scientist | AI/ML Researcher", avatar:"AI", text:"📊 Just published my research paper on 'Transformer Models for Time Series Forecasting' at IEEE Conference!\n\nKey findings:\n• 34% improvement in accuracy over traditional LSTM\n• 60% reduction in training time\n• Novel attention mechanism for seasonal patterns\n\nLink in comments. Would love your feedback! 🧠\n\n#MachineLearning #AI #Research #DataScience", likes:["u1","u2","u3","u4","u5","u6","u7","u8","u9","u10","u11","u12"], comments:134, shares:89, time:"6h", color:"#059669" },
  { id:"s4", authorName:"Vikram Singh", authorTitle:"Product Manager @ Flipkart", avatar:"VS", text:"The best product lesson I learned this year:\n\n❌ Don't build features. Build solutions.\n\nWe spent 3 months building a complex 'feature' that users never asked for. Engagement: 2%.\n\nThen we spent 2 weeks solving a specific pain point. Engagement: 67%.\n\nTalk to your users. Build what they need.\n\n#ProductManagement #StartupLessons #PM #UserResearch", likes:["u1","u2","u3"], comments:203, shares:412, time:"8h", color:"#D97706" },
  { id:"s5", authorName:"Sneha Kulkarni", authorTitle:"UX Designer | Design Thinking Coach", avatar:"SK", text:"🎨 Good design is invisible. Great design is unforgettable.\n\nJust wrapped up a 6-month redesign of our mobile app:\n• Reduced task completion time by 43%\n• Increased user satisfaction score from 3.2 to 4.7/5\n• Cut support tickets by 28%\n\nDesign isn't just about making things pretty. It's about solving problems elegantly.\n\n#UXDesign #ProductDesign #UserExperience", likes:["u1","u2","u3","u4","u5","u6","u7"], comments:56, shares:78, time:"10h", color:"#DB2777" },
  { id:"s6", authorName:"Arjun Patel", authorTitle:"Cloud Architect @ AWS | DevOps", avatar:"AP", text:"☁️ Serverless is not just a buzzword anymore.\n\nWe migrated our monolith to AWS Lambda last quarter:\n\nBefore: 💰 $8,400/month | ⏱️ 800ms | 😤 3 outages/quarter\n\nAfter: 💰 $340/month (96% reduction!) | ⏱️ 180ms | ✅ Zero outages\n\n#AWS #ServerlessArchitecture #CloudComputing #DevOps", likes:["u1","u2","u3","u4","u5","u6","u7","u8","u9","u10","u11"], comments:167, shares:234, time:"12h", color:"#0891B2" },
  { id:"s7", authorName:"Meera Joshi", authorTitle:"Startup Founder | EdTech", avatar:"MJ", text:"We just closed our Seed Round! 🌱\n\n$2.5M raised to democratize coding education in Tier 2 & 3 Indian cities.\n\n📈 40,000 students in 8 months\n🎯 78% course completion rate\n💼 3,200+ students placed in tech jobs\n\nThis is just the beginning.\n\n#EdTech #StartupFunding #SeedRound #Education", likes:["u1","u2","u3","u4","u5","u6","u7","u8","u9","u10","u11","u12","u13","u14","u15"], comments:312, shares:567, time:"1d", color:"#7C3AED" },
  { id:"s8", authorName:"Karan Malhotra", authorTitle:"Cybersecurity Expert | CISSP", avatar:"KM", text:"🔐 I just ethically hacked a major Indian bank (with permission) and found 3 critical vulnerabilities.\n\n⚠️ SQL injection in login API\n⚠️ Exposed admin panel with default credentials\n⚠️ Unencrypted PII in API responses\n\nResponsibly disclosed. Patched within 72 hours.\n\n#Cybersecurity #EthicalHacking #BugBounty #InfoSec", likes:["u1","u2","u3","u4","u5","u6","u7","u8"], comments:94, shares:178, time:"1d", color:"#DC2626" },
  { id:"s9", authorName:"Divya Nair", authorTitle:"HR Director | Talent Acquisition", avatar:"DN", text:"📢 Your resume gets 6 seconds of attention. Here's what makes it survive:\n\n✅ Quantify everything: 'Increased sales by 34%'\n✅ ATS keywords from the job description\n✅ Single page for < 5 years experience\n✅ Action verbs: Built, Led, Designed, Reduced\n✅ No photos, no objectives section\n\nSave this. Share with someone job hunting. ♻️\n\n#JobSearch #Resume #CareerTips #HR", likes:["u1","u2","u3","u4","u5","u6","u7","u8","u9","u10","u11","u12","u13","u14","u15","u16","u17","u18"], comments:892, shares:2341, time:"2d", color:"#059669" },
  { id:"s10", authorName:"Rohit Bansal", authorTitle:"Android Developer @ Zomato", avatar:"RB", text:"🤖 Android tip that saved us 40% battery consumption:\n\nWe were running background sync every 5 minutes. Users complained about battery drain.\n\nSolution: WorkManager with smart constraints — requires battery not low + network connected.\n\nResult: Same data freshness, 40% less battery impact.\n\n#AndroidDev #Kotlin #MobileDev", likes:["u1","u2","u3","u4"], comments:43, shares:67, time:"2d", color:"#2563EB" },
  { id:"s11", authorName:"Kavitha Reddy", authorTitle:"Blockchain Developer | Web3", avatar:"KR", text:"🌐 The Web3 revolution is real.\n\n2 years building on Ethereum:\n1. Smart contracts are immutable — test obsessively\n2. Gas optimization is an art form\n3. The community is incredibly welcoming\n4. DYOR is not optional\n\nCurrently hiring Solidity devs. DM me!\n\n#Web3 #Blockchain #Solidity #DeFi", likes:["u1","u2","u3","u4","u5","u6"], comments:78, shares:45, time:"2d", color:"#7C3AED" },
  { id:"s12", authorName:"Amit Sharma", authorTitle:"Engineering Manager @ Microsoft", avatar:"AS", text:"After 10 years in tech, here's what separates good engineers from great ones:\n\n❌ Good: Solves the problem\n✅ Great: Understands WHY it's a problem\n\n❌ Good: Writes working code\n✅ Great: Writes maintainable code\n\n❌ Good: Meets deadlines\n✅ Great: Communicates risks early\n\nWhat would you add? 👇\n\n#SoftwareEngineering #TechCareers", likes:["u1","u2","u3","u4","u5","u6","u7","u8","u9","u10","u11","u12","u13","u14","u15","u16","u17","u18","u19","u20"], comments:1247, shares:3891, time:"3d", color:"#0891B2" },
  { id:"s13", authorName:"Pooja Krishnan", authorTitle:"Marketing Lead | Growth Hacker", avatar:"PK", text:"📈 How we grew from 0 to 100K users in 6 months without paid ads:\n\n1. Obsessive SEO: ranked for 200+ keywords\n2. Viral referral program\n3. Community building: Discord with 15K members\n4. Content marketing: 3 posts/week\n5. Product-led growth\n\nTotal marketing spend: ₹0 🚀\n\n#GrowthHacking #Marketing #Startup", likes:["u1","u2","u3","u4","u5","u6","u7","u8","u9","u10","u11","u12"], comments:445, shares:892, time:"3d", color:"#DB2777" },
  { id:"s14", authorName:"Suresh Nambiar", authorTitle:"iOS Developer | Swift Expert", avatar:"SN", text:"📱 SwiftUI vs UIKit in 2025:\n\nSwiftUI pros: Faster development, declarative, great previews\nSwiftUI cons: Still maturing, complex animations tricky\n\nUIKit pros: Battle-tested, full control\nUIKit cons: Verbose, boilerplate-heavy\n\nMy recommendation: SwiftUI with UIKit fallback.\n\n#iOS #Swift #SwiftUI #MobileDevelopment", likes:["u1","u2","u3","u4","u5"], comments:89, shares:34, time:"4d", color:"#D97706" },
  { id:"s15", authorName:"Nisha Agarwal", authorTitle:"Data Engineer @ Netflix", avatar:"NA", text:"🎬 Netflix processes 1+ trillion events per day.\n\nI work with:\n• Apache Kafka for real-time streaming\n• Spark for batch processing\n• Flink for stream processing\n• Druid for OLAP queries\n• Delta Lake for data versioning\n\nEvery recommendation you see is powered by this.\n\n#DataEngineering #Netflix #BigData", likes:["u1","u2","u3","u4","u5","u6","u7","u8","u9","u10","u11","u12","u13"], comments:267, shares:445, time:"4d", color:"#DC2626" },
];

function SkeletonPost() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-header">
        <div className="skeleton skeleton-avatar"></div>
        <div className="skeleton-text">
          <div className="skeleton skeleton-line" style={{ width: "60%" }}></div>
          <div className="skeleton skeleton-line" style={{ width: "40%" }}></div>
        </div>
      </div>
      <div className="skeleton skeleton-line" style={{ width: "100%", height: 14 }}></div>
      <div className="skeleton skeleton-line" style={{ width: "90%", height: 14 }}></div>
      <div className="skeleton skeleton-line" style={{ width: "75%", height: 14 }}></div>
    </div>
  );
}

export default function Feed({ onPostsUpdate }) {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const user = auth.currentUser;
  const toast = useToast();

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      limit(20)
    );
    const unsub = onSnapshot(q, snap => {
      const firestorePosts = snap.docs.map(d => ({
        id: d.id, ...d.data(), isReal: true
      }));
      const all = [...firestorePosts, ...SEED_POSTS];
      setPosts(all);
      if (onPostsUpdate) onPostsUpdate(all);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handlePost = async e => {
    e.preventDefault();
    if (!text.trim()) return;
    setPosting(true);
    try {
      await addDoc(collection(db, "posts"), {
        text,
        image: imageUrl || "",
        authorId: user.uid,
        authorName: user.displayName || user.email.split("@")[0],
        authorTitle: "ProNet Member",
        likes: [],
        comments: 0,
        shares: 0,
        createdAt: serverTimestamp(),
        isReal: true,
      });
      setText("");
      setImageUrl("");
      setShowCompose(false);
      toast("Post published successfully! 🎉", "success");
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async post => {
    if (!post.isReal) return;
    const ref = doc(db, "posts", post.id);
    const liked = post.likes?.includes(user.uid);
    await updateDoc(ref, {
      likes: liked
        ? post.likes.filter(id => id !== user.uid)
        : [...(post.likes || []), user.uid],
    });
  };

  return (
    <div className="feed-area">
      <div className="post-composer">
        <div className="composer-row">
          <div className="composer-avatar">
            {user?.email?.[0]?.toUpperCase()}
          </div>
          <div
            className="composer-input"
            onClick={() => setShowCompose(true)}
          >
            Share an update, article, or insight...
          </div>
        </div>
        <div className="composer-actions">
          <button
            className="composer-action-btn"
            onClick={() => setShowCompose(true)}
          >
            <FiImage style={{ color: "#2563EB" }} /> Photo
          </button>
          <button
            className="composer-action-btn"
            onClick={() => setShowCompose(true)}
          >
            <FiVideo style={{ color: "#059669" }} /> Video
          </button>
          <button
            className="composer-action-btn"
            onClick={() => setShowCompose(true)}
          >
            <FiCalendar style={{ color: "#D97706" }} /> Event
          </button>
        </div>
      </div>

      {loading
        ? [1, 2, 3].map(i => <SkeletonPost key={i} />)
        : posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              currentUserId={user?.uid}
              toast={toast}
            />
          ))
      }

      {showCompose && (
        <div
          className="compose-modal-overlay"
          onClick={() => setShowCompose(false)}
        >
          <div
            className="compose-modal"
            onClick={e => e.stopPropagation()}
          >
            <div className="compose-modal-header">
              <h3>Create a post</h3>
              <button
                className="close-btn"
                onClick={() => setShowCompose(false)}
              >
                <FiX />
              </button>
            </div>

            <div className="compose-modal-body">
              <div className="compose-user-info">
                <div className="composer-avatar" style={{ width: 44, height: 44 }}>
                  {user?.email?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>
                    {user?.email?.split("@")[0]}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>
                    Share with your network
                  </div>
                </div>
              </div>

              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="What do you want to talk about?"
                rows={5}
                autoFocus
              />

              <div style={{ marginTop: 10 }}>
                <input
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="📎 Paste an image URL (optional)"
                  style={{ borderRadius: 8, fontSize: 13 }}
                />
              </div>

              {imageUrl && (
                <div style={{ marginTop: 8, position: "relative" }}>
                  <img
                    src={imageUrl}
                    alt="preview"
                    style={{
                      width: "100%", maxHeight: 200,
                      objectFit: "cover", borderRadius: 8,
                      border: "1px solid var(--border)",
                    }}
                    onError={e => (e.target.style.display = "none")}
                  />
                  <button
                    onClick={() => setImageUrl("")}
                    style={{
                      position: "absolute", top: 6, right: 6,
                      background: "rgba(0,0,0,0.6)", color: "white",
                      border: "none", borderRadius: "50%",
                      width: 24, height: 24, cursor: "pointer",
                      display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 12,
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            <div className="compose-modal-footer">
              <div style={{ display: "flex", gap: 8 }}>
                <button className="composer-action-btn"><FiImage /></button>
                <button className="composer-action-btn"><FiVideo /></button>
              </div>
              <button
                className="post-submit-btn"
                onClick={handlePost}
                disabled={!text.trim() || posting}
              >
                {posting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}