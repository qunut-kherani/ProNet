import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { FiSearch, FiUser, FiBriefcase, FiX } from "react-icons/fi";

const JOBS = [
  "Frontend Developer", "Data Analyst Intern", "UI/UX Designer",
  "Backend Developer", "ML Engineer Intern", "DevOps Engineer",
  "Product Manager", "Android Developer", "Cybersecurity Analyst",
  "Full Stack Developer",
];

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    getDocs(collection(db, "users")).then(snap => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  useEffect(() => {
    if (!query.trim()) { setResults([]); setOpen(false); return; }
    const q = query.toLowerCase();
    const peopleResults = users
      .filter(u => u.name?.toLowerCase().includes(q) || u.headline?.toLowerCase().includes(q))
      .slice(0, 4)
      .map(u => ({ type: "person", label: u.name, sub: u.headline || "ProNet Member", id: u.id }));
    const jobResults = JOBS
      .filter(j => j.toLowerCase().includes(q))
      .slice(0, 3)
      .map(j => ({ type: "job", label: j, sub: "View job listing" }));
    setResults([...peopleResults, ...jobResults]);
    setOpen(true);
  }, [query, users]);

  useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = result => {
    setQuery("");
    setOpen(false);
    if (result.type === "job") navigate("/jobs");
    else navigate("/network");
  };

  return (
    <div ref={ref} style={{ position: "relative", flex: 1, maxWidth: 400 }}>
      <div style={{ position: "relative" }}>
        <FiSearch style={{
          position: "absolute", left: 12, top: "50%",
          transform: "translateY(-50%)", color: "var(--muted)", fontSize: 16,
        }} />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => query && setOpen(true)}
          placeholder="Search people, jobs, skills..."
          style={{
            paddingLeft: 38,
            paddingRight: query ? 36 : 14,
            borderRadius: 24,
            background: "var(--mint)",
            fontSize: 14,
            height: 40,
          }}
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setOpen(false); }}
            style={{
              position: "absolute", right: 10, top: "50%",
              transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer",
              color: "var(--muted)", fontSize: 16,
            }}
          >
            <FiX />
          </button>
        )}
      </div>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0,
          background: "var(--white)", border: "1.5px solid var(--border)",
          borderRadius: 12, boxShadow: "var(--shadow-hover)",
          zIndex: 1000, overflow: "hidden", maxHeight: 320, overflowY: "auto",
        }}>
          {results.length === 0 ? (
            <div style={{
              padding: "1rem", textAlign: "center",
              color: "var(--muted)", fontSize: 13,
            }}>
              No results for "{query}"
            </div>
          ) : (
            <>
              {results.filter(r => r.type === "person").length > 0 && (
                <div style={{
                  padding: "8px 14px 4px", fontSize: 11, fontWeight: 700,
                  color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1,
                }}>
                  People
                </div>
              )}
              {results.filter(r => r.type === "person").map((r, i) => (
                <div
                  key={i}
                  onClick={() => handleSelect(r)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px", cursor: "pointer", transition: "all 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--mint)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: "var(--mint-secondary)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 700, color: "var(--green-btn)", flexShrink: 0,
                  }}>
                    {r.label?.[0]?.toUpperCase() || <FiUser />}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
                      {r.label}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{r.sub}</div>
                  </div>
                </div>
              ))}

              {results.filter(r => r.type === "job").length > 0 && (
                <div style={{
                  padding: "8px 14px 4px", fontSize: 11, fontWeight: 700,
                  color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1,
                  borderTop: "1px solid var(--border)",
                }}>
                  Jobs
                </div>
              )}
              {results.filter(r => r.type === "job").map((r, i) => (
                <div
                  key={i}
                  onClick={() => handleSelect(r)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px", cursor: "pointer", transition: "all 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--mint)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: 8,
                    background: "var(--mint-secondary)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--green-btn)", flexShrink: 0,
                  }}>
                    <FiBriefcase />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
                      {r.label}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{r.sub}</div>
                  </div>
                </div>
              ))}

              <div
                style={{
                  padding: "10px 14px", borderTop: "1px solid var(--border)",
                  fontSize: 13, color: "var(--green-btn)", fontWeight: 600,
                  cursor: "pointer", textAlign: "center",
                }}
                onClick={() => { navigate("/network"); setOpen(false); setQuery(""); }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--mint)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                See all results for "{query}" →
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}