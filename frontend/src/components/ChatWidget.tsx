import { useState, useEffect } from "react";
import type { Message } from "../types";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { apiService } from "../services/api";

const SESSION_STORAGE_KEY = "chat_session_id";

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedSessionId = localStorage.getItem(SESSION_STORAGE_KEY);
    if (savedSessionId) {
      setSessionId(savedSessionId);
      loadHistory(savedSessionId);
    }
  }, []);

  const loadHistory = async (sessionId: string) => {
    try {
      const history = await apiService.getHistory(sessionId);
      setMessages(
        history.map((msg) => ({
          ...msg,
          timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
        }))
      );
    } catch (err) {
      console.error("Failed to load history:", err);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (isLoading) return;

    const userMessage: Message = {
      sender: "user",
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.sendMessage(
        text,
        sessionId || undefined
      );

      if (response.sessionId !== sessionId) {
        setSessionId(response.sessionId);
        localStorage.setItem(SESSION_STORAGE_KEY, response.sessionId);
      }

      const aiMessage: Message = {
        sender: "ai",
        text: response.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to send message. Please try again.";
      setError(errorMessage);

      setMessages((prev) => prev.filter((msg) => msg !== userMessage));

      const errorMsg: Message = {
        sender: "ai",
        text: `Error: ${errorMessage}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white overflow-hidden rounded-lg shadow-lg">
      <div className="px-6 sm:px-8 md:px-12 lg:px-16 py-5 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
                CS
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Customer Support
              </h2>
              <p className="text-xs text-gray-500">
                We typically reply in a few minutes
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="pt-4 h-full">
          <MessageList messages={messages} isTyping={isLoading} />
        </div>
      </div>

      {error && (
        <div className="px-6 sm:px-8 md:px-12 lg:px-16 py-4 bg-red-50 border-t border-red-100 flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-red-700">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="flex-shrink-0">
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}
