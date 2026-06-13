import { FiUserCheck, FiUserPlus, FiMessageCircle, FiX } from "react-icons/fi";

export default function ConnectionCard({
  user: u,
  status,
  onConnect,
  onAccept,
  onReject,
  onRemove,
  toast,
}) {
  const initials = u.name
    ? u.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";
  const color = u.color || "var(--green-btn)";

  const handleConnect = () => {
    onConnect(u.uid);
    if (toast) toast(`Connection request sent to ${u.name}! 🤝`, "success");
  };

  const handleAccept = () => {
    onAccept(u.uid);
    if (toast) toast(`You are now connected with ${u.name}! 🎉`, "success");
  };

  const handleReject = () => {
    onReject(u.uid);
    if (toast) toast("Request declined.", "info");
  };

  const handleRemove = () => {
    onRemove(u.uid);
    if (toast) toast(`Removed connection with ${u.name}.`, "warning");
  };

  return (
    <div className="connection-card">
      <div
        className="conn-avatar"
        style={{ background: `${color}22`, color }}
      >
        {u.photoURL
          ? <img src={u.photoURL} alt={u.name} />
          : initials}
      </div>

      <div className="conn-name">{u.name}</div>

      <div className="conn-title">
        {u.headline || u.designation || "ProNet Member"}
      </div>

      {u.location && (
        <div style={{ fontSize: 11, color: "var(--muted)" }}>
          📍 {u.location}
        </div>
      )}

      {u.mutual > 0 && (
        <div className="conn-mutual">
          🤝 {u.mutual} mutual connections
        </div>
      )}

      {status === "connected" && (
        <div className="conn-actions">
          <button
            className="conn-connect-btn connected"
            onClick={handleRemove}
            style={{ flex: 1 }}
          >
            <FiUserCheck style={{ marginRight: 4 }} />
            Connected
          </button>
          <button className="conn-msg-btn">
            <FiMessageCircle />
          </button>
        </div>
      )}

      {status === "pending" && (
        <button
          className="conn-connect-btn pending"
          style={{ width: "100%" }}
          disabled
        >
          Pending...
        </button>
      )}

      {status === "received" && (
        <div className="request-actions">
          <button className="accept-btn" onClick={handleAccept}>
            Accept
          </button>
          <button className="reject-btn" onClick={handleReject}>
            Decline
          </button>
        </div>
      )}

      {status === "none" && (
        <div className="conn-actions">
          <button
            className="conn-connect-btn"
            onClick={handleConnect}
            style={{ flex: 1 }}
          >
            <FiUserPlus style={{ marginRight: 4 }} />
            Connect
          </button>
          <button className="conn-msg-btn">
            <FiMessageCircle />
          </button>
        </div>
      )}
    </div>
  );
}