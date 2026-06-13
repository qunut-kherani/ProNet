import { useState, useEffect } from "react";
import {
  collection, addDoc, onSnapshot,
  orderBy, query, serverTimestamp
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { FiSend, FiMessageCircle } from "react-icons/fi";

function timeAgo(ts) {
  if (!ts) return "Just now";
  const d = ts?.toDate?.() || new Date(ts);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export default function Comments({ postId, isReal, onClose }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    if (!isReal || !postId) return;
    const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, snap => {
      setComments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [postId, isReal]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!text.trim() || !isReal) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "posts", postId, "comments"), {
        text,
        authorId: user.uid,
        authorName: user.displayName || user.email.split("@")[0],
        createdAt: serverTimestamp(),
      });
      setText("");
    } finally {
      setLoading(false);
    }
  };

  const initials = n =>
    n?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";

  return (
    <div style={{
      borderTop: "1px solid var(--border)",
      background: "var(--mint)",
      padding: "0.8rem 1rem",
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 10,
      }}>
        <span style={{
          fontSize: 13, fontWeight: 700, color: "var(--text)",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <FiMessageCircle style={{ color: "var(--green-btn)" }} />
          {comments.length} Comment{comments.length !== 1 ? "s" : ""}
        </span>
        <button onClick={onClose} style={{
          background: "none", border: "none",
          cursor: "pointer", color: "var(--muted)", fontSize: 12,
        }}>
          Hide ▲
        </button>
      </div>

      <div style={{
        display: "flex", flexDirection: "column", gap: 10,
        maxHeight: 280, overflowY: "auto", marginBottom: 12,
      }}>
        {comments.length === 0 && (
          <p style={{
            fontSize: 13, color: "var(--muted)",
            textAlign: "center", padding: "10px 0",
          }}>
            Be the first to comment!
          </p>
        )}
        {comments.map(c => (
          <div key={c.id} style={{ display: "flex", gap: 8 }}>
            <div style={{
              width: 34, height: 34, minWidth: 34, borderRadius: "50%",
              background: "var(--mint-secondary)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, color: "var(--green-btn)",
            }}>
              {initials(c.authorName)}
            </div>
            <div style={{
              background: "var(--white)", borderRadius: "0 12px 12px 12px",
              padding: "8px 12px", flex: 1,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}>
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", marginBottom: 3,
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
                  {c.authorName}
                </span>
                <span style={{ fontSize: 11, color: "var(--muted)" }}>
                  {timeAgo(c.createdAt)}
                </span>
              </div>
              <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>
                {c.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
        <div style={{
          width: 34, height: 34, minWidth: 34, borderRadius: "50%",
          background: "var(--mint-secondary)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 700, color: "var(--green-btn)",
        }}>
          {user?.email?.[0]?.toUpperCase()}
        </div>
        <div style={{ flex: 1, position: "relative" }}>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={
              isReal
                ? "Write a comment..."
                : "Comments available on your own posts"
            }
            disabled={!isReal}
            style={{
              borderRadius: 24, paddingRight: 44,
              fontSize: 13, background: "var(--white)",
            }}
          />
          <button
            type="submit"
            disabled={!text.trim() || loading || !isReal}
            style={{
              position: "absolute", right: 6, top: "50%",
              transform: "translateY(-50%)",
              width: 30, height: 30, borderRadius: "50%",
              background: text.trim() ? "var(--green-btn)" : "var(--mint-secondary)",
              color: text.trim() ? "white" : "var(--muted)",
              border: "none",
              cursor: text.trim() ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, transition: "all 0.2s",
            }}
          >
            <FiSend />
          </button>
        </div>
      </form>
    </div>
  );
}