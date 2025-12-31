import { ChatMessageRequest } from '../types/index.js';

const MAX_MESSAGE_LENGTH = 5000;

export function validateChatMessage(
  body: unknown
): body is ChatMessageRequest {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const request = body as Record<string, unknown>;

  if (!request.message || typeof request.message !== 'string') {
    return false;
  }

  if (request.message.trim().length === 0) {
    return false;
  }

  if (request.message.length > MAX_MESSAGE_LENGTH) {
    return false;
  }

  if (request.sessionId !== undefined && typeof request.sessionId !== 'string') {
    return false;
  }

  return true;
}

export function truncateMessage(message: string, maxLength: number = MAX_MESSAGE_LENGTH): string {
  if (message.length <= maxLength) {
    return message;
  }
  return message.substring(0, maxLength - 3) + '...';
}






