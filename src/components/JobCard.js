import { FiMapPin, FiClock, FiDollarSign, FiBookmark } from "react-icons/fi";

export default function JobCard({ job, applied, onApply, toast }) {
  const handleApply = () => {
    if (applied) return;
    onApply(job);
    if (toast) toast(`Applied to ${job.title} at ${job.company}! 🎉`, "success");
  };

  return (
    <div className="job-card">
      <div style={{ display: "flex", gap: 14, flex: 1 }}>
        <div className="job-logo">{job.logo}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div className="job-title">{job.title}</div>
            <button
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "var(--muted)", fontSize: 18, padding: 4,
                borderRadius: "50%", transition: "all 0.2s",
              }}
              title="Save job"
              onMouseEnter={e => e.currentTarget.style.color = "var(--green-btn)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}
            >
              <FiBookmark />
            </button>
          </div>

          <div className="job-company">{job.company}</div>

          <div className="job-meta">
            <span className="job-meta-tag">
              <FiMapPin size={12} /> {job.location}
            </span>
            <span className="job-meta-tag">
              <FiClock size={12} /> {job.posted}
            </span>
            <span className="job-meta-tag">
              <FiDollarSign size={12} /> {job.salary}
            </span>
            <span className="job-type-badge">{job.type}</span>
          </div>

          <div className="skill-tags" style={{ marginTop: 10 }}>
            {job.skills.map(s => (
              <span key={s} className="skill-tag">{s}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
        <button
          className={`apply-btn ${applied ? "applied" : ""}`}
          onClick={handleApply}
          disabled={applied}
        >
          {applied ? "✓ Applied" : "Easy Apply"}
        </button>
        {applied && (
          <span style={{ fontSize: 11, color: "var(--green-btn)", fontWeight: 600 }}>
            Application sent!
          </span>
        )}
      </div>
    </div>
  );
}