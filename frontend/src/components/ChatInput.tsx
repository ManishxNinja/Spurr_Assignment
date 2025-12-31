import { useState, type KeyboardEvent } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { cn } from "../lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage("");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-3 px-6 sm:px-8 md:px-12 lg:px-16 py-5 border-t border-gray-200 bg-white shadow-lg z-10">
      <Textarea
        className="flex-1 min-h-[52px] max-h-[120px] resize-none border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all text-sm px-5 py-4 bg-white"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Type a message..."
        disabled={disabled}
        rows={1}
      />
      <Button
        className={cn(
          "h-[52px] w-[52px] flex-shrink-0 rounded-xl transition-all shadow-md",
          disabled || !message.trim()
            ? "opacity-50 cursor-not-allowed bg-gray-300 hover:bg-gray-300"
            : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
        )}
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        aria-label="Send message"
        size="icon"
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
}
