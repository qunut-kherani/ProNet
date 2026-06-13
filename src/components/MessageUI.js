import { useState } from "react";
import { FiSend } from "react-icons/fi";

const DUMMY_CONVERSATIONS = [
  { id:1, name:"Mohammed Hanif", lastMsg:"Hey! Saw your profile...", time:"2m" },
  { id:2, name:"Mohammed Junaid", lastMsg:"Thanks for connecting!", time:"1h" },
  { id:3, name:"Mohammed Ibrahim", lastMsg:"Are you open to freelance?", time:"3h" },
];

export default function MessageUI() {
  const [active, setActive] = useState(DUMMY_CONVERSATIONS[0]);
  const [messages, setMessages] = useState([
    { from:"them", text:"Hey! Saw your profile, really impressive work!" },
    { from:"me", text:"Thank you so much! Happy to connect." },
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { from:"me", text:input }]);
    setInput("");
  };

  return (
    <div className="messaging-layout">
      <div className="convo-list">
        <h3>Messages</h3>
        {DUMMY_CONVERSATIONS.map(c => (
          <div key={c.id} className={`convo-item ${active.id === c.id ? "active" : ""}`} onClick={() => setActive(c)}>
            <div className="convo-avatar">{c.name[0]}</div>
            <div>
              <strong>{c.name}</strong>
              <p>{c.lastMsg}</p>
            </div>
            <span className="convo-time">{c.time}</span>
          </div>
        ))}
      </div>
      <div className="chat-area">
        <div className="chat-header">{active.name}</div>
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.from === "me" ? "msg-me" : "msg-them"}`}>
              {m.text}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Write a message..." onKeyDown={e => e.key === "Enter" && send()} />
          <button onClick={send}><FiSend /></button>
        </div>
      </div>
    </div>
  );
}