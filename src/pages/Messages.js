import { useState } from "react";
import Navbar from "../components/Navbar";
import { FiSend, FiSearch, FiMoreHorizontal } from "react-icons/fi";

const CONVERSATIONS = [
  { id:1, name:"Priya Sharma", role:"Software Engineer @ Google", lastMsg:"Would love to connect!", time:"2m", unread:true, color:"#7C3AED" },
  { id:2, name:"Rahul Mehta", role:"Full Stack Developer", lastMsg:"Thanks for connecting!", time:"1h", unread:false, color:"#2563EB" },
  { id:3, name:"Ananya Iyer", role:"Data Scientist", lastMsg:"Sure, let's schedule a call", time:"3h", unread:true, color:"#059669" },
  { id:4, name:"Vikram Singh", role:"Product Manager", lastMsg:"Great question!", time:"1d", unread:false, color:"#D97706" },
  { id:5, name:"Sneha Kulkarni", role:"UX Designer", lastMsg:"I'll send you the Figma link", time:"2d", unread:false, color:"#DB2777" },
  { id:6, name:"Arjun Patel", role:"Cloud Architect", lastMsg:"That's a great approach!", time:"3d", unread:false, color:"#0891B2" },
];

const INITIAL_MSGS = {
  1: [
    { from:"them", text:"Hi! I came across your profile and I'm really impressed with your work on React projects.", time:"10:30 AM" },
    { from:"me", text:"Thank you so much! Happy to connect.", time:"10:32 AM" },
    { from:"them", text:"Would love to connect and maybe collaborate sometime!", time:"10:33 AM" },
    { from:"me", text:"Absolutely! What are you working on currently?", time:"10:35 AM" },
  ],
  2: [
    { from:"them", text:"Thanks for connecting! I see we're both React developers.", time:"Yesterday" },
    { from:"me", text:"Yes! Your post on GraphQL was really insightful.", time:"Yesterday" },
    { from:"them", text:"Thanks for connecting!", time:"Yesterday" },
  ],
  3: [
    { from:"them", text:"Hi! I saw your comment on the ML post. Very insightful!", time:"3h ago" },
    { from:"me", text:"Thank you! I'm really passionate about AI/ML.", time:"3h ago" },
    { from:"them", text:"Sure, let's schedule a call to discuss further.", time:"2h ago" },
  ],
};

const AUTO_REPLIES = [
  "That's really interesting! Tell me more.",
  "Great point! I completely agree.",
  "Thanks for sharing that perspective!",
  "I'd love to collaborate on something like that.",
  "That's awesome! Congratulations!",
  "Let's definitely stay connected.",
];

export default function Messages() {
  const [active, setActive] = useState(CONVERSATIONS[0]);
  const [messages, setMessages] = useState(INITIAL_MSGS);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  const currentMsgs = messages[active.id] || [];

  const send = () => {
    if (!input.trim()) return;
    const newMsg = { from: "me", text: input, time: "Just now" };
    setMessages(prev => ({
      ...prev,
      [active.id]: [...(prev[active.id] || []), newMsg]
    }));
    setInput("");
    setTimeout(() => {
      const reply = { from: "them", text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)], time: "Just now" };
      setMessages(prev => ({
        ...prev,
        [active.id]: [...(prev[active.id] || []), reply]
      }));
    }, 1200);
  };

  const filtered = CONVERSATIONS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="messaging-page">
        <div className="messaging-layout">
          {/* Conversation List */}
          <div className="convo-list">
            <div className="convo-list-header">Messages</div>
            <div className="convo-search">
              <div style={{ position: "relative" }}>
                <FiSearch style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--muted)", fontSize: 14 }} />
                <input
                  placeholder="Search messages..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ paddingLeft: 32, fontSize: 13 }}
                />
              </div>
            </div>
            <div className="convo-items">
              {filtered.map(c => (
                <div key={c.id} className={`convo-item ${active.id === c.id ? "active" : ""}`} onClick={() => setActive(c)}>
                  <div className="convo-item-avatar" style={{ background: `${c.color}22`, color: c.color }}>
                    {c.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="convo-item-name">{c.name}</div>
                    <div className="convo-item-msg">{c.lastMsg}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <span className="convo-item-time">{c.time}</span>
                    {c.unread && <div className="convo-unread"></div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="chat-area">
            <div className="chat-header">
              <div className="convo-item-avatar" style={{ background: `${active.color}22`, color: active.color, width: 40, height: 40 }}>
                {active.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <div className="chat-header-name">{active.name}</div>
                <div className="chat-header-status">● Active now</div>
              </div>
              <button style={{ marginLeft: "auto", background: "none", color: "var(--muted)", fontSize: 20 }}>
                <FiMoreHorizontal />
              </button>
            </div>

            <div className="chat-messages" id="chat-messages">
              {currentMsgs.map((m, i) => (
                <div key={i} className="msg-group" style={{ alignItems: m.from === "me" ? "flex-end" : "flex-start" }}>
                  <div className={`msg-bubble ${m.from === "me" ? "msg-me" : "msg-them"}`}>
                    {m.text}
                  </div>
                  <div className={`msg-time ${m.from === "me" ? "me" : ""}`}>{m.time}</div>
                </div>
              ))}
            </div>

            <div className="chat-input-area">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send()}
                placeholder={`Message ${active.name}...`}
              />
              <button className="send-btn" onClick={send}>
                <FiSend />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}