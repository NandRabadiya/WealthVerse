import React, { useState, useEffect, useRef } from "react";
import ChatService from "./ChatService";
import { X, Send } from "lucide-react";

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
    try {
      if (chatId) await ChatService.endChat(chatId, userId);
      setChatId(null);
      setMessages([]);
      setIsOpen(false);
    } catch (error) {
      console.error("Error ending chat:", error);
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
          content:
            "⚠️ Sorry, I couldn't process your request. Please try again.",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen ? (
        <button
          onClick={startNewChat}
          disabled={isLoading}
          className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold px-6 py-3 rounded-full shadow-lg transition-all duration-300 cursor-pointer"
        >
          {isLoading ? "Loading..." : "💬 Chat with AI"}
        </button>
      ) : (
        <div className="w-96 h-[500px] bg-gray-900 rounded-2xl shadow-xl flex flex-col overflow-hidden animate-fade-in">
          <div className="bg-gradient-to-r from-blue-800 to-purple-800 text-white px-5 py-3 flex justify-between items-center">
            <h3 className="text-lg font-bold tracking-wide">
              💰 Finance Assistant
            </h3>
            <button
              onClick={endChat}
              className="cursor-pointer transition-transform duration-200 ease-out hover:scale-125"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col gap-1 ${
                  msg.isUser ? "items-end" : "items-start"
                } animate-slide-up`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-xs text-sm transition-colors duration-300 ${
                    msg.isUser
                      ? "bg-green-500 text-black"
                      : "bg-blue-800 text-white"
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-gray-400 text-[10px]">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
            {isLoading && (
              <div className="text-white text-sm animate-pulse">
                🤖 Typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={sendMessage}
            className="bg-gray-800 px-4 py-3 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about your finances..."
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition duration-300 cursor-pointer"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
