export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  CHAT_MESSAGE: `${API_BASE_URL}/chat/message`,
  CHAT_HISTORY: (sessionId: string) => `${API_BASE_URL}/chat/history/${sessionId}`,
};






