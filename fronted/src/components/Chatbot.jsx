import React, { useState, useEffect, useRef, useContext } from "react";
import { AppContext } from "../context/AppContext";
import Markdown from "react-markdown";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const { backendUrl } = useContext(AppContext);

  // 🔄 Scroll to bottom when new message added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🚫 Disable background scroll when chatbot is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  const sendMessage = async (msgText) => {
    const text = msgText || input.trim();
    if (!text) return;

    const userMsg = { sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${backendUrl}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      const botMsg = { sender: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Unable to connect to chatbot." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 🧠 Predefined suggestions
  const suggestions = [
    "How to book an appointment?",
    "Show me available doctors.",
    "What are Hospitalo’s features?",
    "How to contact support?",
  ];

  return (
    <>
      {/* 💬 Floating Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 bg-blue-600 text-white rounded-full p-4 cursor-pointer shadow-lg hover:scale-110 hover:bg-blue-700 transition-transform z-50"
      >
        💬
      </div>

      {/* 🧠 Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 bg-white dark:bg-[#0f172a]/50 backdrop-blur-sm shadow-2xl rounded-2xl w-80 sm:w-96 border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden animate-fadeIn z-50 max-h-[75vh]">
          {/* Header */}
          <div className="bg-[var(--color-primary)] text-white text-center p-3 font-semibold text-lg">
            Hospitalo ChatBot 🤖
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3 bg-gray-50 dark:bg-[#0f172a]/50 backdrop-blur-xl scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-100">
            {messages.length === 0 && (
              <div className="text-gray-400 dark:text-gray-300 text-center mt-6 text-sm">
                👋 Hi! Ask me anything about Hospitalo.
              </div>
            )}

            {/* 💡 Suggestion Buttons */}
            {messages.length === 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s)}
                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-200 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`my-2 flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] p-2 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-blue-100 text-right text-gray-800"
                      : "bg-white dark:bg-gray-600 text-left text-gray-800 dark:text-gray-200"
                  }`}
                >
                  <div className="reset-tw">
                    <Markdown>{msg.text}</Markdown>
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-gray-400 text-center text-sm mt-2">
                Typing...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex items-center border-t bg-gray-100 dark:bg-gray-400/50 backdrop-blur-sm">
            <input
              type="text"
              className="flex-1 p-2 outline-none bg-transparent text-sm font-medium dark:text-black"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={() => sendMessage()}
              className="bg-[#5f6FFF] text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
