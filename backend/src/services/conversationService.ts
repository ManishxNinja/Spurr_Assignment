import prisma from '../lib/prisma.js';
import { Message, MessageSender } from '../types/index.js';

export class ConversationService {
  async getOrCreateConversation(sessionId?: string): Promise<string> {
    if (sessionId) {
      const conversation = await prisma.conversation.findUnique({
        where: { id: sessionId },
      });
      if (conversation) {
        return conversation.id;
      }
    }

    const newConversation = await prisma.conversation.create({
      data: {},
    });
    return newConversation.id;
  }

  async saveMessage(
    conversationId: string,
    sender: MessageSender,
    text: string
  ): Promise<Message> {
    const message = await prisma.message.create({
      data: {
        conversationId,
        sender,
        text,
      },
    });

    return {
      id: message.id,
      conversationId: message.conversationId,
      sender: message.sender as MessageSender,
      text: message.text,
      timestamp: message.timestamp,
    };
  }

  async getConversationHistory(
    conversationId: string,
    limit: number = 10
  ): Promise<Message[]> {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { timestamp: 'asc' },
      take: limit,
    });

    return messages.map((msg) => ({
      id: msg.id,
      conversationId: msg.conversationId,
      sender: msg.sender as MessageSender,
      text: msg.text,
      timestamp: msg.timestamp,
    }));
  }

  async getAllMessages(conversationId: string): Promise<Message[]> {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { timestamp: 'asc' },
    });

    return messages.map((msg) => ({
      id: msg.id,
      conversationId: msg.conversationId,
      sender: msg.sender as MessageSender,
      text: msg.text,
      timestamp: msg.timestamp,
    }));
  }
}

export const conversationService = new ConversationService();






