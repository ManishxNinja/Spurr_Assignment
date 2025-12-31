import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message } from "../types/index.js";

const SYSTEM_PROMPT = `You are a helpful support agent for a small e-commerce store. Answer clearly and concisely.

Store Information:
- Shipping: We offer free shipping on orders over $50. Standard shipping (5-7 business days) is $5.99. Express shipping (2-3 business days) is $12.99.
- Returns: We accept returns within 30 days of purchase. Items must be unworn, unwashed, and in original packaging. Return shipping is free for exchanges.
- Refunds: Refunds are processed within 5-7 business days after we receive the returned item.
- Support Hours: Our customer support team is available Monday-Friday, 9 AM - 6 PM EST.
- Contact: For urgent matters, email support@store.com or call 1-800-STORE-01.

Be friendly, professional, and helpful. If you don't know something, admit it and offer to connect them with a human agent.`;

export class LLMService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private maxHistoryMessages: number = 10;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  async generateReply(
    userMessage: string,
    conversationHistory: Message[]
  ): Promise<string> {
    try {
      const recentHistory = conversationHistory.slice(-this.maxHistoryMessages);

      let prompt = SYSTEM_PROMPT + "\n\n";

      if (recentHistory.length > 0) {
        prompt += "Previous conversation:\n";
        for (const msg of recentHistory) {
          const role = msg.sender === "user" ? "User" : "Assistant";
          prompt += `${role}: ${msg.text}\n`;
        }
        prompt += "\n";
      }

      prompt += `User: ${userMessage}\nAssistant:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const reply = response.text();

      if (!reply) {
        throw new Error("No reply generated from Gemini");
      }

      return reply.trim();
    } catch (error: any) {
      if (error?.message) {
        if (
          error.message.includes("404") ||
          error.message.includes("not found") ||
          error.message.includes("not supported")
        ) {
          console.error("Gemini API Error:", error.message);
          throw new Error(
            `Model not found: ${error.message}. Try using "gemini-1.5-flash", "gemini-1.5-pro", or check available models in Google AI Studio.`
          );
        } else if (
          error.message.includes("API_KEY_INVALID") ||
          error.message.includes("401") ||
          error.message.includes("API key not valid") ||
          error.message.includes("invalid API key")
        ) {
          throw new Error(
            "Invalid API key. Please check your Gemini API key. Get a free key at https://makersuite.google.com/app/apikey"
          );
        } else if (
          error.message.includes("429") ||
          error.message.includes("RESOURCE_EXHAUSTED") ||
          error.message.includes("quota") ||
          error.message.includes("rate limit")
        ) {
          throw new Error("Rate limit exceeded. Please try again in a moment.");
        } else if (
          error.message.includes("500") ||
          error.message.includes("503") ||
          error.message.includes("UNAVAILABLE") ||
          error.message.includes("SERVICE_UNAVAILABLE")
        ) {
          throw new Error(
            "Gemini service is temporarily unavailable. Please try again later."
          );
        }
      }

      if (error instanceof Error && error.message.includes("timeout")) {
        throw new Error("Request timed out. Please try again.");
      }

      throw new Error(
        `Failed to generate reply: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

export const llmService = new LLMService();
