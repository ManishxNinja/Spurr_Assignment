import { useEffect, useRef } from "react";
import type { Message } from "../types";
import MessageBubble from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
  isTyping?: boolean;
}

export default function MessageList({ messages, isTyping }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-6 sm:px-8 md:px-12 lg:px-16 py-8 flex flex-col bg-gray-50">
      {messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Start a conversation
            </h3>
            <p className="text-sm text-gray-500">
              Ask us anything about shipping, returns, refunds, or support
              hours.
            </p>
          </div>
        </div>
      )}
      {messages.map((message, index) => (
        <MessageBubble key={message.id || index} message={message} />
      ))}
      {isTyping && (
        <div className="flex justify-start mb-6 ml-2">
          <div className="flex gap-1.5 px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl rounded-bl-sm shadow-sm">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
