import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      onClick={() => setDark(d => !d)}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "8px 14px", borderRadius: 20,
        background: dark ? "#1f2937" : "var(--mint-secondary)",
        color: dark ? "#f9fafb" : "var(--text)",
        border: "1.5px solid var(--border)",
        fontSize: 13, fontWeight: 600, cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? <FiSun style={{ color: "#fbbf24" }} /> : <FiMoon style={{ color: "#6366f1" }} />}
      {dark ? "Light" : "Dark"}
    </button>
  );
}