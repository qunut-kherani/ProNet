import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { Link } from "react-router-dom";
import { FiCheckCircle, FiCircle, FiX } from "react-icons/fi";

const STEPS = [
  { key: "photoURL",   label: "Add profile photo",       points: 20 },
  { key: "headline",   label: "Add a headline",           points: 15 },
  { key: "bio",        label: "Write your About section", points: 15 },
  { key: "skills",     label: "Add skills",               points: 15 },
  { key: "experience", label: "Add work experience",      points: 20 },
  { key: "education",  label: "Add education",            points: 10 },
  { key: "location",   label: "Add your location",        points: 5  },
];

function isComplete(profile, key) {
  const v = profile[key];
  if (!v) return false;
  if (Array.isArray(v)) return v.length > 0;
  return String(v).trim().length > 0;
}

export default function ProfileCompletion() {
  const [profile, setProfile] = useState(null);
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem("profileCardDismissed") === "true"
  );
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "users", user.uid)).then(snap => {
      if (snap.exists()) setProfile(snap.data());
    });
  }, [user]);

  if (!profile || dismissed) return null;

  const completedPoints = STEPS.reduce(
    (acc, s) => acc + (isComplete(profile, s.key) ? s.points : 0), 0
  );
  const pct = Math.min(completedPoints, 100);

  if (pct === 100) return null;

  const incomplete = STEPS.filter(s => !isComplete(profile, s.key));
  const next = incomplete[0];
  const color = pct < 40 ? "#ef4444" : pct < 70 ? "#f59e0b" : "#22c55e";

  return (
    <div style={{
      background: "var(--white)",
      border: "1.5px solid var(--border)",
      borderRadius: 12,
      padding: "1rem",
      boxShadow: "var(--shadow)",
      marginBottom: "1rem",
      position: "relative",
    }}>
      <button
        onClick={() => {
          setDismissed(true);
          localStorage.setItem("profileCardDismissed", "true");
        }}
        style={{
          position: "absolute", top: 10, right: 10,
          background: "none", border: "none", cursor: "pointer",
          color: "var(--muted)", fontSize: 16,
        }}
      >
        <FiX />
      </button>

      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 8,
      }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
          Profile strength
        </span>
        <span style={{ fontSize: 13, fontWeight: 800, color }}>{pct}%</span>
      </div>

      <div style={{
        height: 8, borderRadius: 10,
        background: "var(--mint-secondary)",
        marginBottom: 12, overflow: "hidden",
      }}>
        <div style={{
          height: "100%", borderRadius: 10,
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          transition: "width 1s ease",
        }} />
      </div>

      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>
        {pct < 40 ? "🔴 Just getting started" :
         pct < 70 ? "🟡 Intermediate" :
         "🟢 Almost there!"}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {STEPS.map(s => {
          const done = isComplete(profile, s.key);
          return (
            <div key={s.key} style={{
              display: "flex", alignItems: "center", gap: 8,
              fontSize: 12,
              color: done ? "var(--muted)" : "var(--text)",
              textDecoration: done ? "line-through" : "none",
              opacity: done ? 0.6 : 1,
            }}>
              {done
                ? <FiCheckCircle style={{ color: "#22c55e", flexShrink: 0 }} />
                : <FiCircle style={{ color: "var(--muted)", flexShrink: 0 }} />}
              {s.label}
              <span style={{
                marginLeft: "auto",
                color: "var(--green-btn)",
                fontWeight: 600,
              }}>
                +{s.points}%
              </span>
            </div>
          );
        })}
      </div>

      {next && (
        <Link to="/profile" style={{
          display: "block", marginTop: 12, textAlign: "center",
          padding: "9px", borderRadius: 20,
          background: "var(--green-btn)", color: "white",
          fontSize: 13, fontWeight: 600, textDecoration: "none",
        }}>
          Complete: {next.label} →
        </Link>
      )}
    </div>
  );
}