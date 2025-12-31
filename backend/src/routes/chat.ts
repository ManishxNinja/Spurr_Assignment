import express, { Request, Response, NextFunction } from "express";
import { validateChatMessage, truncateMessage } from "../utils/validation.js";
import { conversationService } from "../services/conversationService.js";
import { llmService } from "../services/llmService.js";

const router = express.Router();

router.post(
  "/message",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!validateChatMessage(req.body)) {
        return res.status(400).json({
          error: "Invalid request",
          message:
            "Message is required and must be a non-empty string (max 5000 characters)",
        });
      }

      const { message, sessionId } = req.body;

      const truncatedMessage = truncateMessage(message);

      const conversationId = await conversationService.getOrCreateConversation(
        sessionId
      );

      await conversationService.saveMessage(
        conversationId,
        "user",
        truncatedMessage
      );

      const history = await conversationService.getConversationHistory(
        conversationId
      );

      let aiReply: string;
      try {
        aiReply = await llmService.generateReply(truncatedMessage, history);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to generate reply";
        console.error("LLM error:", errorMessage);

        aiReply = `I apologize, but I'm experiencing technical difficulties. ${errorMessage} Please try again in a moment.`;
      }

      await conversationService.saveMessage(conversationId, "ai", aiReply);

      res.json({
        reply: aiReply,
        sessionId: conversationId,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/history/:sessionId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId } = req.params;
      const messages = await conversationService.getAllMessages(sessionId);
      res.json({ messages });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
