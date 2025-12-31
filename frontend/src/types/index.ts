export interface Message {
  id?: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp?: Date;
}

export interface ChatMessageRequest {
  message: string;
  sessionId?: string;
}

export interface ChatMessageResponse {
  reply: string;
  sessionId: string;
}






