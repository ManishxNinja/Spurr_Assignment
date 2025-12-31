import type { Message } from "../types";
import { cn } from "../lib/utils";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === "user";
  const isError = message.text.startsWith("Error:");

  return (
    <div
      className={cn(
        "flex mb-6 animate-in fade-in slide-in-from-bottom-2 duration-200",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] sm:max-w-[75%] break-words",
          isUser
            ? "flex flex-col items-end mr-2"
            : "flex flex-col items-start ml-2"
        )}
      >
        <div
          className={cn(
            "rounded-2xl shadow-md",
            isUser
              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-sm px-6 py-4"
              : isError
              ? "bg-red-50 text-red-800 border border-red-200 rounded-bl-sm px-6 py-4"
              : "bg-gray-50 text-gray-900 border border-gray-200 rounded-bl-sm px-6 py-4"
          )}
        >
          <div
            className={cn(
              "leading-relaxed whitespace-pre-wrap",
              isUser
                ? "text-white text-[15px]"
                : isError
                ? "text-red-800 text-sm"
                : "text-gray-800 text-sm"
            )}
          >
            {isError ? message.text.replace("Error: ", "") : message.text}
          </div>
        </div>
        {message.timestamp && (
          <span
            className={cn(
              "text-xs mt-2 px-2 text-gray-400 font-medium",
              isUser ? "text-right" : "text-left"
            )}
          >
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>
    </div>
  );
}
