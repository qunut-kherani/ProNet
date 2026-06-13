import { Link, useLocation } from "react-router-dom";
import { FiHome, FiUsers, FiBriefcase, FiMessageCircle, FiUser } from "react-icons/fi";

const NAV_ITEMS = [
  { path: "/home",     icon: <FiHome />,          label: "Home"     },
  { path: "/network",  icon: <FiUsers />,         label: "Network"  },
  { path: "/jobs",     icon: <FiBriefcase />,     label: "Jobs"     },
  { path: "/messages", icon: <FiMessageCircle />, label: "Messages" },
  { path: "/profile",  icon: <FiUser />,          label: "Profile"  },
];

export default function MobileNav() {
  const location = useLocation();
  return (
    <div className="mobile-bottom-nav">
      <div className="mobile-bottom-nav-inner">
        {NAV_ITEMS.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`mobile-nav-item ${location.pathname === item.path ? "active" : ""}`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}