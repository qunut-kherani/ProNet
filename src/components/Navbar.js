import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import {
  FiHome, FiUsers, FiBriefcase,
  FiMessageCircle, FiUser, FiLogOut
} from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = path => location.pathname === path;

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <nav className="navbar" style={{ gap: 16 }}>
      <Link to="/home" className="nav-logo" style={{ flexShrink: 0 }}>
        Pro<span>Net</span>
      </Link>

      <SearchBar />

      <div className="nav-links">
        <Link to="/home" className={`nav-link ${isActive("/home") ? "active" : ""}`}>
          <FiHome /><span>Home</span>
        </Link>
        <Link to="/network" className={`nav-link ${isActive("/network") ? "active" : ""}`}>
          <FiUsers /><span>Network</span>
        </Link>
        <Link to="/jobs" className={`nav-link ${isActive("/jobs") ? "active" : ""}`}>
          <FiBriefcase /><span>Jobs</span>
        </Link>
        <Link to="/messages" className={`nav-link ${isActive("/messages") ? "active" : ""}`}>
          <FiMessageCircle /><span>Messages</span>
        </Link>
        <Link to="/profile" className={`nav-link ${isActive("/profile") ? "active" : ""}`}>
          <FiUser /><span>Profile</span>
        </Link>
        <ThemeToggle />
        <button className="nav-logout" onClick={handleLogout}>
          <FiLogOut /><span>Logout</span>
        </button>
      </div>
    </nav>
  );
}