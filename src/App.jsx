import React, { useEffect, useState, useRef } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { auth, provider, db } from "./firebase";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // 🔹 Login automático
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 🔹 Buscar mensagens em tempo real
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // 🔹 Scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔹 Login com Google
  const handleLogin = async () => {
    await signInWithPopup(auth, provider);
  };

  // 🔹 Logout
  const handleLogout = async () => {
    await signOut(auth);
  };

  // 🔹 Enviar mensagem
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await addDoc(collection(db, "messages"), {
      text: newMessage,
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      timestamp: serverTimestamp(),
    });

    setNewMessage("");
  };

  return (
    <div className="app">
      {!user ? (
        <div className="login-container">
          <h2>Bem-vindo ao Chat</h2>
          <button onClick={handleLogin}>Entrar com Google</button>
        </div>
      ) : (
        <div className="chat-container">
          <div className="chat-header">
            <img src={user.photoURL} alt="avatar" className="avatar" />
            <h3>Chat Global</h3>
            <button onClick={handleLogout}>Sair</button>
          </div>

          <div className="messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${
                  msg.uid === user.uid ? "sent" : "received"
                }`}
              >
                {msg.photoURL && (
                  <img src={msg.photoURL} alt="avatar" className="msg-avatar" />
                )}
                <div className="msg-content">
                  <p>{msg.text}</p>
                  <span className="msg-time">
                    {msg.timestamp?.toDate().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="input-container">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua mensagem"
            />
            <button type="submit">Enviar</button>
          </form>
        </div>
      )}
    </div>
  );
}
