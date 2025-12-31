export interface ChatMessageRequest {
  message: string;
  sessionId?: string;
}

export interface ChatMessageResponse {
  reply: string;
  sessionId: string;
}

export type MessageSender = 'user' | 'ai';

export interface Message {
  id: string;
  conversationId: string;
  sender: MessageSender;
  text: string;
  timestamp: Date;
}






