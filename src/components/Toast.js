import { useState, useEffect, createContext, useContext, useCallback } from "react";

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

const ICONS = {
  success: "✅",
  error: "❌",
  info: "💡",
  warning: "⚠️",
};

const COLORS = {
  success: { bg: "#f0fdf4", border: "#86efac", text: "#166534" },
  error:   { bg: "#fef2f2", border: "#fca5a5", text: "#991b1b" },
  info:    { bg: "#eff6ff", border: "#93c5fd", text: "#1e40af" },
  warning: { bg: "#fffbeb", border: "#fcd34d", text: "#92400e" },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = "success", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const remove = id => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div style={{
        position: "fixed", bottom: 24, right: 24,
        display: "flex", flexDirection: "column", gap: 10,
        zIndex: 9999, maxWidth: 360,
      }}>
        {toasts.map(t => {
          const c = COLORS[t.type] || COLORS.success;
          return (
            <div key={t.id} style={{
              display: "flex", alignItems: "center", gap: 10,
              background: c.bg, border: `1.5px solid ${c.border}`,
              color: c.text, borderRadius: 12, padding: "12px 16px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              animation: "slideIn 0.3s ease",
              fontSize: 14, fontWeight: 500,
            }}>
              <span style={{ fontSize: 18 }}>{ICONS[t.type]}</span>
              <span style={{ flex: 1 }}>{t.message}</span>
              <button onClick={() => remove(t.id)} style={{
                background: "none", border: "none", cursor: "pointer",
                color: c.text, fontSize: 16, padding: "0 4px", opacity: 0.7,
              }}>✕</button>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}