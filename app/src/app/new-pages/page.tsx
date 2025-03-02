"use client";

import React, { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

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
        {
          role: "Gemini",
          text: "Sorry, there was an error. Please try again later.",
        },
      ]);
    }
  };

  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (user) {
    return (
      <div
        className="bg-base-200 flex flex-col justify-center items-center h-full w-screen"
        // style={styles.body}
      >
        <div
          id="chat"
          className="card p-3 bg-base-100 shadow-sm h-[500px] w-[400px] mb-5"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat ${
                msg.role === "user" ? "chat-end" : "chat-start"
              }`}
            >
              <div
                key={index}
                className={`chat-bubble ${
                  msg.role === "user"
                    ? "chat-bubble-primary"
                    : "chat-bubble-info"
                }`}
              >
                {msg.text}
              </div>
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
          className="input w-[400px]"
        />
      </div>
    );
  }
  return (
    <div className="bg-base-200 flex flex-col justify-center items-center h-full w-screen">
      <p className="text-7xl font-black text-red-600 text-center mb-10">
        YOU ARE NOT LOGGED IN!!!!!!
      </p>
      <a className="btn btn-error btn-xl" href="/api/auth/login">
        Login
      </a>
    </div>
  );
}
