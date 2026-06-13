import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { Link } from "react-router-dom";
import { FiBookmark, FiTrendingUp } from "react-icons/fi";

export default function Sidebar() {
  const [profile, setProfile] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "users", user.uid)).then(snap => {
      if (snap.exists()) setProfile(snap.data());
    });
  }, [user]);

  const initials = profile?.name?.[0]?.toUpperCase() || "?";

  return (
    <aside className="sidebar">
      <div className="sidebar-profile-card">
        <div className="sidebar-banner"></div>
        <div className="sidebar-profile-body">
          <div className="sidebar-avatar-wrap">
            <div className="sidebar-avatar">
              {profile?.photoURL
                ? <img src={profile.photoURL} alt="avatar" />
                : initials}
            </div>
          </div>
          <div className="sidebar-name">{profile?.name || "Your Name"}</div>
          <div className="sidebar-headline">{profile?.headline || "Add a headline"}</div>
          <div className="sidebar-stats">
            <div className="sidebar-stat">
              <span>Connections</span>
              <span>{profile?.connections?.length || 0}</span>
            </div>
            <div className="sidebar-stat">
              <span>Profile views</span>
              <span>{Math.floor(Math.random() * 50) + 10}</span>
            </div>
            <div className="sidebar-stat">
              <span>Post impressions</span>
              <span>{Math.floor(Math.random() * 200) + 50}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar-card">
        <h4><FiBookmark style={{ marginRight: 6, verticalAlign: "middle" }} />Quick Links</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {["Saved Jobs", "My Applications", "Learning"].map(item => (
            <div key={item} style={{ fontSize: 13, color: "var(--muted)", cursor: "pointer", padding: "4px 0", borderBottom: "1px solid var(--mint)", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "var(--green-btn)"}
              onMouseLeave={e => e.target.style.color = "var(--muted)"}>
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-card">
        <h4 style={{ marginBottom: 8 }}>Your Skills</h4>
        <div className="skill-tags">
          {(profile?.skills?.slice(0, 5) || ["React", "Firebase"]).map(s => (
            <span key={s} className="skill-tag">{s}</span>
          ))}
        </div>
        <Link to="/profile" style={{ display: "block", marginTop: 10, fontSize: 13, color: "var(--green-btn)", fontWeight: 600 }}>
          Edit skills →
        </Link>
      </div>
    </aside>
  );
}