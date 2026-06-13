import { FiBell } from "react-icons/fi";

export default function Notifications({ posts, currentUserId }) {
  const myPostsWithLikes = (posts || []).filter(
    p => p.authorId === currentUserId && p.likes?.length > 0
  );

  return (
    <div className="notifications-panel">
      <div className="panel-title">
        <FiBell style={{ color: "var(--green-btn)" }} /> Notifications
      </div>
      {myPostsWithLikes.length === 0 ? (
        <p className="no-notif">No new notifications yet</p>
      ) : (
        myPostsWithLikes.map(post => (
          <div key={post.id} className="notif-item">
            <span style={{ fontSize: 16 }}>👍</span>
            <p>Your post received <strong>{post.likes.length}</strong> like{post.likes.length > 1 ? "s" : ""}!</p>
          </div>
        ))
      )}
      <div className="notif-item">
        <span style={{ fontSize: 16 }}>🎉</span>
        <p>Welcome to <strong>ProNet</strong>! Complete your profile.</p>
      </div>
      <div className="notif-item">
        <span style={{ fontSize: 16 }}>💼</span>
        <p><strong>3 new jobs</strong> match your profile.</p>
      </div>
    </div>
  );
}