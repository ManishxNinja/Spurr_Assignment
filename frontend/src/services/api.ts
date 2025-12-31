import type {
  ChatMessageRequest,
  ChatMessageResponse,
  Message,
} from "../types";
import { API_ENDPOINTS } from "../utils/constants";

export class ApiService {
  async sendMessage(
    message: string,
    sessionId?: string
  ): Promise<ChatMessageResponse> {
    const response = await fetch(API_ENDPOINTS.CHAT_MESSAGE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, sessionId } as ChatMessageRequest),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new Error(error.message || error.error || "Failed to send message");
    }

    return response.json();
  }

  async getHistory(sessionId: string): Promise<Message[]> {
    const response = await fetch(API_ENDPOINTS.CHAT_HISTORY(sessionId), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch conversation history");
    }

    const data = await response.json();
    return data.messages || [];
  }
}

export const apiService = new ApiService();
