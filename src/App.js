import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Jobs from "./pages/Jobs";
import Network from "./pages/Network";
import Messages from "./pages/Messages";
import MobileNav from "./components/MobileNav";

function PrivateRoute({ children }) {
  const [user, setUser] = useState(undefined);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return () => unsub();
  }, []);
  if (user === undefined) return (
    <div className="loading">
      <div className="loading-spinner"></div>
      <span>Loading ProNet...</span>
    </div>
  );
  return user ? children : <Navigate to="/" />;
}

function AppContent() {
  const location = useLocation();
  const authPages = ["/", "/signup"];
  const showMobileNav = !authPages.includes(location.pathname);
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/jobs" element={<PrivateRoute><Jobs /></PrivateRoute>} />
        <Route path="/network" element={<PrivateRoute><Network /></PrivateRoute>} />
        <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
      </Routes>
      {showMobileNav && <MobileNav />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}