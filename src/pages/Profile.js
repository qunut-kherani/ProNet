import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import Navbar from "../components/Navbar";
import {
  FiEdit2, FiMapPin, FiPhone, FiMail, FiGlobe,
  FiLinkedin, FiGithub, FiTwitter, FiPlus, FiCheck,
  FiCamera, FiX, FiBriefcase, FiBook, FiDownload
} from "react-icons/fi";

const EMPTY_PROFILE = {
  name: "", headline: "", bio: "", location: "", phone: "",
  website: "", linkedin: "", github: "", twitter: "",
  skills: [], education: [], experience: [],
  photoURL: "", coverURL: ""
};

function EditModal({ title, onClose, onSave, saving, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose}><FiX /></button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={onSave} disabled={saving}>
            {saving ? "Saving..." : <><FiCheck /> Save</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "users", user.uid)).then(snap => {
      if (snap.exists()) {
        setProfile({ ...EMPTY_PROFILE, ...snap.data() });
      } else {
        // Create document if it doesn't exist
        const initial = {
          ...EMPTY_PROFILE,
          uid: user.uid,
          email: user.email,
          name: user.displayName || "",
          createdAt: new Date()
        };
        setDoc(doc(db, "users", user.uid), initial, { merge: true });
        setProfile(initial);
      }
    });
  }, [user]);

  const openEdit = section => {
    setForm({ ...profile });
    setEdit(section);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const update = { ...form };
      if (typeof update.skills === "string") {
        update.skills = update.skills.split(",").map(s => s.trim()).filter(Boolean);
      }
      await setDoc(doc(db, "users", user.uid), update, { merge: true });
      setProfile(prev => ({ ...prev, ...update }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      setEdit(null);
    } catch (err) {
      console.error(err);
      alert("Error saving: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const saveAvatarDirectly = async (field, dataUrl) => {
    try {
      await setDoc(doc(db, "users", user.uid), { [field]: dataUrl }, { merge: true });
      setProfile(p => ({ ...p, [field]: dataUrl }));
    } catch (err) {
      console.error("Image save error:", err);
    }
  };

  const addExperience = () => {
    setForm(f => ({
      ...f,
      experience: [...(f.experience || []),
        { title: "", company: "", duration: "", description: "" }]
    }));
  };

  const addEducation = () => {
    setForm(f => ({
      ...f,
      education: [...(f.education || []),
        { school: "", degree: "", year: "" }]
    }));
  };

  const removeExperience = idx => {
    setForm(f => ({
      ...f,
      experience: f.experience.filter((_, i) => i !== idx)
    }));
  };

  const removeEducation = idx => {
    setForm(f => ({
      ...f,
      education: f.education.filter((_, i) => i !== idx)
    }));
  };

  const initials = profile.name?.[0]?.toUpperCase()
    || user?.email?.[0]?.toUpperCase() || "?";
  const connCount = profile.connections?.length || 0;

  return (
    <>
      <Navbar />
      <div className="profile-page">

        {/* ── Cover + Avatar Card ── */}
        <div className="profile-cover-card">
          <div className="profile-cover">
            {profile.coverURL
              ? <img src={profile.coverURL} alt="cover" />
              : null}
            <label className="cover-edit-btn" style={{ cursor: "pointer" }}>
              <FiCamera /> Edit cover
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = ev => saveAvatarDirectly("coverURL", ev.target.result);
                  reader.readAsDataURL(file);
                }}
              />
            </label>
          </div>

          <div className="profile-info-section">
            <div className="profile-avatar-row">
              {/* Avatar upload */}
              <label style={{ cursor: "pointer" }}>
                <div className="profile-avatar-wrap">
                  {profile.photoURL
                    ? <img src={profile.photoURL} alt={profile.name} />
                    : initials}
                  <div className="avatar-edit-overlay"><FiCamera /></div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = ev => saveAvatarDirectly("photoURL", ev.target.result);
                    reader.readAsDataURL(file);
                  }}
                />
              </label>

              <div className="profile-actions">
                {saved && (
                  <div className="saved-indicator">
                    <FiCheck /> Saved!
                  </div>
                )}
                <button className="btn-outline" onClick={() => openEdit("main")}>
                  <FiEdit2 /> Edit Profile
                </button>
              </div>
            </div>

            <h1 className="profile-name">{profile.name || "Your Name"}</h1>
            <p className="profile-headline">
              {profile.headline || "Add a professional headline"}
            </p>
            {profile.location && (
              <p className="profile-location">
                <FiMapPin size={14} /> {profile.location}
              </p>
            )}
            <p className="profile-connections">{connCount} connections</p>

            <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
              <button className="btn-primary" onClick={() => openEdit("main")}>
                <FiEdit2 /> Edit intro
              </button>
              <button className="btn-outline" onClick={() => openEdit("experience")}>
                <FiPlus /> Add experience
              </button>
            </div>
          </div>
        </div>

        {/* ── About ── */}
        <div className="profile-section-card">
          <div className="section-header">
            <h2 className="section-title">About</h2>
            <button className="section-edit-btn" onClick={() => openEdit("about")}>
              <FiEdit2 />
            </button>
          </div>
          <p style={{
            fontSize: 14, lineHeight: 1.8,
            color: "var(--text)", whiteSpace: "pre-line"
          }}>
            {profile.bio ||
              "Tell your professional story — what drives you, what you've built, and what you're looking for."}
          </p>
        </div>

        {/* ── Experience ── */}
        <div className="profile-section-card">
          <div className="section-header">
            <h2 className="section-title">
              <FiBriefcase style={{ marginRight: 8, verticalAlign: "middle" }} />
              Experience
            </h2>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="section-edit-btn" onClick={() => openEdit("experience")}>
                <FiPlus />
              </button>
              <button className="section-edit-btn" onClick={() => openEdit("experience")}>
                <FiEdit2 />
              </button>
            </div>
          </div>
          {profile.experience?.length > 0 ? (
            profile.experience.map((exp, i) => (
              <div key={i} className="experience-item">
                <div className="exp-logo">🏢</div>
                <div>
                  <div className="exp-title">{exp.title}</div>
                  <div className="exp-company">{exp.company}</div>
                  <div className="exp-duration">{exp.duration}</div>
                  {exp.description && (
                    <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p style={{ fontSize: 13, color: "var(--muted)" }}>
              Add your work experience
            </p>
          )}
        </div>

        {/* ── Education ── */}
        <div className="profile-section-card">
          <div className="section-header">
            <h2 className="section-title">
              <FiBook style={{ marginRight: 8, verticalAlign: "middle" }} />
              Education
            </h2>
            <button className="section-edit-btn" onClick={() => openEdit("education")}>
              <FiEdit2 />
            </button>
          </div>
          {profile.education?.length > 0 ? (
            profile.education.map((edu, i) => (
              <div key={i} className="education-item">
                <div className="exp-logo">🎓</div>
                <div>
                  <div className="exp-title">{edu.school}</div>
                  <div className="exp-company">{edu.degree}</div>
                  <div className="exp-duration">{edu.year}</div>
                </div>
              </div>
            ))
          ) : (
            <p style={{ fontSize: 13, color: "var(--muted)" }}>
              Add your education
            </p>
          )}
        </div>

        {/* ── Skills ── */}
        <div className="profile-section-card">
          <div className="section-header">
            <h2 className="section-title">Skills</h2>
            <button className="section-edit-btn" onClick={() => openEdit("skills")}>
              <FiEdit2 />
            </button>
          </div>
          {profile.skills?.length > 0 ? (
            <div className="skill-tags">
              {profile.skills.map(s => (
                <span key={s} className="skill-tag">{s}</span>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 13, color: "var(--muted)" }}>
              Add your top skills
            </p>
          )}
        </div>

        {/* ── Contact & Social ── */}
        <div className="profile-section-card">
          <div className="section-header">
            <h2 className="section-title">Contact Information</h2>
            <button className="section-edit-btn" onClick={() => openEdit("contact")}>
              <FiEdit2 />
            </button>
          </div>
          <div className="contact-info">
            <div className="contact-row">
              <FiMail /> {user?.email}
            </div>
            {profile.phone && (
              <div className="contact-row"><FiPhone /> {profile.phone}</div>
            )}
            {profile.website && (
              <div className="contact-row">
                <FiGlobe />
                <a href={profile.website} target="_blank" rel="noreferrer"
                  style={{ color: "var(--green-btn)" }}>
                  {profile.website}
                </a>
              </div>
            )}
          </div>
          {(profile.linkedin || profile.github || profile.twitter) && (
            <div className="social-links" style={{ marginTop: 14 }}>
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer"
                  className="social-link">
                  <FiLinkedin /> LinkedIn
                </a>
              )}
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noreferrer"
                  className="social-link">
                  <FiGithub /> GitHub
                </a>
              )}
              {profile.twitter && (
                <a href={profile.twitter} target="_blank" rel="noreferrer"
                  className="social-link">
                  <FiTwitter /> Twitter
                </a>
              )}
            </div>
          )}
        </div>

        {/* ── Resume ── */}
        <div className="profile-section-card">
          <div className="section-header">
            <h2 className="section-title">Resume</h2>
          </div>
          <label className="btn-outline"
            style={{ cursor: "pointer", display: "inline-flex" }}>
            <FiDownload /> Upload Resume (PDF)
            <input type="file" accept=".pdf" style={{ display: "none" }} />
          </label>
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
            Upload your resume to make it easier for recruiters to find you.
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════
          EDIT MODALS
      ══════════════════════════════════════ */}

      {/* Main Info Modal */}
      {edit === "main" && (
        <EditModal
          title="Edit intro"
          onClose={() => setEdit(null)}
          onSave={saveProfile}
          saving={saving}
        >
          <div className="input-row">
            <div className="input-group">
              <label>Full Name</label>
              <input
                value={form.name || ""}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Your full name"
              />
            </div>
            <div className="input-group">
              <label>Location</label>
              <input
                value={form.location || ""}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                placeholder="City, Country"
              />
            </div>
          </div>
          <div className="input-group">
            <label>Headline</label>
            <input
              value={form.headline || ""}
              onChange={e => setForm(f => ({ ...f, headline: e.target.value }))}
              placeholder="e.g. Software Engineer @ Google | React Developer"
            />
          </div>
          <div className="input-group">
            <label>Cover Photo URL</label>
            <input
              value={form.coverURL || ""}
              onChange={e => setForm(f => ({ ...f, coverURL: e.target.value }))}
              placeholder="https://images.unsplash.com/..."
            />
            <span style={{ fontSize: 11, color: "var(--muted)" }}>
              Or use the camera button on the cover image to upload directly
            </span>
          </div>
        </EditModal>
      )}

      {/* About Modal */}
      {edit === "about" && (
        <EditModal
          title="Edit About"
          onClose={() => setEdit(null)}
          onSave={saveProfile}
          saving={saving}
        >
          <div className="input-group">
            <label>About / Bio</label>
            <textarea
              value={form.bio || ""}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              rows={7}
              placeholder="Tell your professional story — what drives you, your achievements, and what you're looking for..."
            />
          </div>
        </EditModal>
      )}

      {/* Skills Modal */}
      {edit === "skills" && (
        <EditModal
          title="Edit Skills"
          onClose={() => setEdit(null)}
          onSave={saveProfile}
          saving={saving}
        >
          <div className="input-group">
            <label>Skills (comma-separated)</label>
            <textarea
              value={Array.isArray(form.skills)
                ? form.skills.join(", ")
                : form.skills || ""}
              onChange={e => setForm(f => ({ ...f, skills: e.target.value }))}
              rows={4}
              placeholder="React, Firebase, JavaScript, Node.js, Python, CSS..."
            />
          </div>
          <p style={{ fontSize: 12, color: "var(--muted)" }}>
            Separate each skill with a comma. Add up to 50 skills.
          </p>
          {/* Preview */}
          {form.skills && (
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Preview:</p>
              <div className="skill-tags">
                {(typeof form.skills === "string"
                  ? form.skills.split(",").map(s => s.trim()).filter(Boolean)
                  : form.skills
                ).map(s => (
                  <span key={s} className="skill-tag">{s}</span>
                ))}
              </div>
            </div>
          )}
        </EditModal>
      )}

      {/* Experience Modal */}
      {edit === "experience" && (
        <EditModal
          title="Edit Experience"
          onClose={() => setEdit(null)}
          onSave={saveProfile}
          saving={saving}
        >
          {(form.experience || []).map((exp, i) => (
            <div key={i} style={{
              padding: 14, background: "var(--mint)",
              borderRadius: 10, marginBottom: 12, position: "relative"
            }}>
              <button
                onClick={() => removeExperience(i)}
                style={{
                  position: "absolute", top: 10, right: 10,
                  background: "#fde8e8", color: "#dc2626",
                  border: "none", borderRadius: "50%",
                  width: 26, height: 26, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}
              >
                <FiX size={13} />
              </button>
              <div className="input-row">
                <div className="input-group">
                  <label>Job Title</label>
                  <input
                    value={exp.title}
                    onChange={e => {
                      const arr = [...form.experience];
                      arr[i] = { ...arr[i], title: e.target.value };
                      setForm(f => ({ ...f, experience: arr }));
                    }}
                    placeholder="Software Engineer"
                  />
                </div>
                <div className="input-group">
                  <label>Company</label>
                  <input
                    value={exp.company}
                    onChange={e => {
                      const arr = [...form.experience];
                      arr[i] = { ...arr[i], company: e.target.value };
                      setForm(f => ({ ...f, experience: arr }));
                    }}
                    placeholder="Google"
                  />
                </div>
              </div>
              <div className="input-group" style={{ marginTop: 10 }}>
                <label>Duration</label>
                <input
                  value={exp.duration}
                  onChange={e => {
                    const arr = [...form.experience];
                    arr[i] = { ...arr[i], duration: e.target.value };
                    setForm(f => ({ ...f, experience: arr }));
                  }}
                  placeholder="Jan 2023 – Present · 1 yr 6 mos"
                />
              </div>
              <div className="input-group" style={{ marginTop: 10 }}>
                <label>Description</label>
                <textarea
                  value={exp.description}
                  onChange={e => {
                    const arr = [...form.experience];
                    arr[i] = { ...arr[i], description: e.target.value };
                    setForm(f => ({ ...f, experience: arr }));
                  }}
                  rows={2}
                  placeholder="Describe your role and achievements..."
                />
              </div>
            </div>
          ))}
          <button
            className="btn-outline"
            onClick={addExperience}
            style={{ width: "100%", justifyContent: "center" }}
          >
            <FiPlus /> Add Another Experience
          </button>
        </EditModal>
      )}

      {/* Education Modal */}
      {edit === "education" && (
        <EditModal
          title="Edit Education"
          onClose={() => setEdit(null)}
          onSave={saveProfile}
          saving={saving}
        >
          {(form.education || []).map((edu, i) => (
            <div key={i} style={{
              padding: 14, background: "var(--mint)",
              borderRadius: 10, marginBottom: 12, position: "relative"
            }}>
              <button
                onClick={() => removeEducation(i)}
                style={{
                  position: "absolute", top: 10, right: 10,
                  background: "#fde8e8", color: "#dc2626",
                  border: "none", borderRadius: "50%",
                  width: 26, height: 26, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}
              >
                <FiX size={13} />
              </button>
              <div className="input-group">
                <label>School / University</label>
                <input
                  value={edu.school}
                  onChange={e => {
                    const arr = [...form.education];
                    arr[i] = { ...arr[i], school: e.target.value };
                    setForm(f => ({ ...f, education: arr }));
                  }}
                  placeholder="IIT Bombay"
                />
              </div>
              <div className="input-row" style={{ marginTop: 10 }}>
                <div className="input-group">
                  <label>Degree</label>
                  <input
                    value={edu.degree}
                    onChange={e => {
                      const arr = [...form.education];
                      arr[i] = { ...arr[i], degree: e.target.value };
                      setForm(f => ({ ...f, education: arr }));
                    }}
                    placeholder="BTech Computer Science"
                  />
                </div>
                <div className="input-group">
                  <label>Year</label>
                  <input
                    value={edu.year}
                    onChange={e => {
                      const arr = [...form.education];
                      arr[i] = { ...arr[i], year: e.target.value };
                      setForm(f => ({ ...f, education: arr }));
                    }}
                    placeholder="2021 – 2025"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            className="btn-outline"
            onClick={addEducation}
            style={{ width: "100%", justifyContent: "center" }}
          >
            <FiPlus /> Add Another Education
          </button>
        </EditModal>
      )}

      {/* Contact Modal */}
      {edit === "contact" && (
        <EditModal
          title="Contact Information"
          onClose={() => setEdit(null)}
          onSave={saveProfile}
          saving={saving}
        >
          <div className="input-group">
            <label>Phone Number</label>
            <input
              value={form.phone || ""}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="+91 98765 43210"
            />
          </div>
          <div className="input-group">
            <label>Website / Portfolio</label>
            <input
              value={form.website || ""}
              onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
              placeholder="https://yourportfolio.com"
            />
          </div>
          <div className="input-group">
            <label>LinkedIn URL</label>
            <input
              value={form.linkedin || ""}
              onChange={e => setForm(f => ({ ...f, linkedin: e.target.value }))}
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          <div className="input-group">
            <label>GitHub URL</label>
            <input
              value={form.github || ""}
              onChange={e => setForm(f => ({ ...f, github: e.target.value }))}
              placeholder="https://github.com/username"
            />
          </div>
          <div className="input-group">
            <label>Twitter / X URL</label>
            <input
              value={form.twitter || ""}
              onChange={e => setForm(f => ({ ...f, twitter: e.target.value }))}
              placeholder="https://twitter.com/username"
            />
          </div>
        </EditModal>
      )}
    </>
  );
}