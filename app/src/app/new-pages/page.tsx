"use client";

import React, { useState } from "react";

export default function NewPage() {
  const [messages, setMessages] = useState([]); 
  const [input, setInput] = useState(""); 

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", text: input },
    ]);

    setInput("");

    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error("Error");
      }

      const data = await response.json();
      const botResponse = data.response;

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "Gemini", text: botResponse },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "Gemini", text: "Sorry, there was an error. Please try again later." },
      ]);
    }
  };

  return (
    <div style={styles.body}>
      <div id="chat" style={styles.chat}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              ...(msg.role === "user" ? styles.user : styles.bot),
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        id="input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type your message..."
        style={styles.input}
      />
    </div>
  );
}

// 内联样式
const styles = {
  body: {
    fontFamily: "Arial, sans-serif",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f4f4f9",
  },
  chat: {
    width: "400px",
    height: "500px",
    border: "1px solid #ccc",
    padding: "10px",
    overflowY: "auto",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  input: {
    width: "400px",
    marginTop: "10px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "16px",
  },
  message: {
    marginBottom: "10px",
    padding: "8px",
    borderRadius: "4px",
  },
  user: {
    backgroundColor: "#e3f2fd",
    textAlign: "right",
  },
  bot: {
    backgroundColor: "#f5f5f5",
    textAlign: "left",
  },
};