import { useState } from "react";
import { FiThumbsUp, FiMessageCircle, FiShare2, FiMoreHorizontal } from "react-icons/fi";
import Comments from "./Comments";

function timeAgo(ts) {
  if (!ts) return "Just now";
  if (typeof ts === "string") return ts;
  const d = ts?.toDate?.() || new Date(ts);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function PostCard({ post, onLike, currentUserId, toast }) {
  const liked = post.likes?.includes(currentUserId);
  const likeCount = post.likes?.length || 0;
  const [showComments, setShowComments] = useState(false);
  const [copied, setCopied] = useState(false);
  const initials = post.avatar ||
    post.authorName?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "?";
  const color = post.color || "var(--green-btn)";

  const handleLike = () => {
    onLike(post);
    if (toast) toast(
      liked ? "Like removed" : "You liked this post! 👍",
      liked ? "info" : "success"
    );
  };

  const handleShare = () => {
    navigator.clipboard.writeText(post.text || "");
    setCopied(true);
    if (toast) toast("Post copied to clipboard! 📋", "info");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="post-card">
      <div className="post-card-header">
        <div className="post-avatar" style={{ background: `${color}22`, color }}>
          {post.photoURL
            ? <img src={post.photoURL} alt={post.authorName} />
            : initials}
        </div>
        <div style={{ flex: 1 }}>
          <div className="post-author-name">{post.authorName}</div>
          <div className="post-author-title">
            {post.authorTitle || post.designation || "ProNet Member"}
          </div>
          <div className="post-time">{timeAgo(post.createdAt || post.time)}</div>
        </div>
        <button className="post-more-btn"><FiMoreHorizontal /></button>
      </div>

      <div className="post-content">
        {post.text?.split("\n").map((line, i) => (
          <span key={i}>
            {line.split(/(\#\w+)/g).map((part, j) =>
              part.startsWith("#")
                ? <span key={j} className="post-hashtags">{part}</span>
                : part
            )}
            {i < post.text.split("\n").length - 1 && <br />}
          </span>
        ))}
      </div>

      {post.image && (
        <img
          src={post.image}
          alt="post"
          className="post-image"
          onError={e => (e.target.style.display = "none")}
        />
      )}

      <div className="post-engagement">
        <div className="post-reactions">
          <span className="reaction-emoji">👍</span>
          <span className="reaction-emoji">🎉</span>
          <span className="reaction-emoji">💡</span>
          {likeCount > 0 && <span style={{ marginLeft: 4 }}>{likeCount}</span>}
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {(post.comments > 0 || showComments) && (
            <span
              style={{ cursor: "pointer", color: "var(--muted)" }}
              onClick={() => setShowComments(s => !s)}
            >
              {post.comments || 0} comments
            </span>
          )}
          {post.shares > 0 && <span>{post.shares} shares</span>}
        </div>
      </div>

      <div className="post-actions">
        <button
          className={`post-action-btn ${liked ? "liked" : ""}`}
          onClick={handleLike}
        >
          <FiThumbsUp /> {liked ? "Liked" : "Like"}
        </button>
        <button
          className={`post-action-btn ${showComments ? "liked" : ""}`}
          onClick={() => setShowComments(s => !s)}
        >
          <FiMessageCircle /> Comment
        </button>
        <button className="post-action-btn" onClick={handleShare}>
          <FiShare2 /> {copied ? "Copied!" : "Share"}
        </button>
      </div>

      {showComments && (
        <Comments
          postId={post.id}
          isReal={post.isReal}
          onClose={() => setShowComments(false)}
        />
      )}
    </div>
  );
}