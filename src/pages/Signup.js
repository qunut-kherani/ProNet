import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async e => {
    e.preventDefault();
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError(""); setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        name: form.name,
        email: form.email,
        headline: "",
        bio: "",
        location: "",
        skills: [],
        education: [],
        experience: [],
        phone: "",
        website: "",
        linkedin: "",
        github: "",
        twitter: "",
        photoURL: "",
        coverURL: "",
        connections: [],
        connectionRequests: [],
        createdAt: new Date()
      });
      navigate("/home");
    } catch (err) {
      setError(err.message.replace("Firebase: ", "").replace(/\(auth.*\)/, ""));
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-logo">Pro<span>Net</span></div>
        <h2>Join ProNet today</h2>
        <p className="auth-subtitle">Build your professional presence</p>
        {error && <div className="error-msg">{error}</div>}
        <form className="auth-form" onSubmit={handleSignup}>
          <div className="form-group">
            <label>Full Name</label>
            <div style={{ position: "relative" }}>
              <FiUser style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
              <input name="name" placeholder="Your full name"
                onChange={handleChange} required style={{ paddingLeft: 36 }} />
            </div>
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <div style={{ position: "relative" }}>
              <FiMail style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
              <input name="email" type="email" placeholder="you@example.com"
                onChange={handleChange} required style={{ paddingLeft: 36 }} />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={{ position: "relative" }}>
              <FiLock style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
              <input name="password" type={showPass ? "text" : "password"}
                placeholder="Create a password (6+ chars)"
                onChange={handleChange} required style={{ paddingLeft: 36, paddingRight: 40 }} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", color: "var(--muted)", fontSize: 18 }}>
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p style={{ fontSize: 11, color: "var(--muted)", textAlign: "center", marginTop: 10 }}>
          By joining, you agree to ProNet's Terms and Privacy Policy.
        </p>
        <div className="divider">or</div>
        <p className="auth-switch">Already on ProNet? <Link to="/">Sign in</Link></p>
      </div>
    </div>
  );
}