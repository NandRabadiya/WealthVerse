import React, { useState, useEffect, useRef } from "react";
// import ChatService from "./ChatService";
import "./ChatBot.css";

const ChatBot = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const startNewChat = async () => {
    try {
      setIsLoading(true);
      const response = await ChatService.startChat(userId);
      setChatId(response.data.chat_id);
      setMessages([
        {
          id: "system-welcome",
          content: response.data.message,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
      setIsOpen(true);
    } catch (error) {
      console.error("Error starting chat:", error);
      alert("Failed to start chat. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const endChat = async () => {
    if (chatId) {
      try {
        await ChatService.endChat(chatId, userId);
        setChatId(null);
        setMessages([]);
        setIsOpen(false);
      } catch (error) {
        console.error("Error ending chat:", error);
      }
    } else {
      setIsOpen(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || !chatId) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await ChatService.sendMessage(
        chatId,
        userId,
        inputMessage
      );

      setMessages((prev) => [
        ...prev,
        {
          id: response.data.message_id,
          content: response.data.content,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          content: "Sorry, I couldn't process your request. Please try again.",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`chatbot-container ${isOpen ? "open" : ""}`}>
      {!isOpen ? (
        <button
          className="chat-button"
          onClick={startNewChat}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Chat with AI"}
        </button>
      ) : (
        <div className="chat-window">
          <div className="chat-header">
            <h3>Finance Assistant</h3>
            <button onClick={endChat} className="close-button">
              End Chat
            </button>
          </div>

          <div className="messages-container">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${
                  msg.isUser ? "user-message" : "bot-message"
                }`}
              >
                <div className="message-content">{msg.content}</div>
                <div className="message-timestamp">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message bot-message">
                <div className="message-content typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="message-input-form">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me about your finances..."
              disabled={isLoading}
              className="message-input"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="send-button"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
