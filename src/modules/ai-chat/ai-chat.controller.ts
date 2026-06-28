import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AiChatService } from './ai-chat.service.js';
import { AuthRequest } from '../../middlewares/auth.middleware.js';

const aiChatService = new AiChatService();

export class AiChatController {
  async sendMessage(req: AuthRequest, res: Response) {
    try {
      const { content, conversationId } = req.body;
      const result = await aiChatService.sendMessage(req.user!.id, content, conversationId);
      res.status(StatusCodes.OK).json(result);
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async listConversations(req: AuthRequest, res: Response) {
    try {
      const conversations = await aiChatService.listConversations(req.user!.id);
      res.status(StatusCodes.OK).json(conversations);
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  async getHistory(req: AuthRequest, res: Response) {
    try {
      const history = await aiChatService.getConversationHistory(req.params.id, req.user!.id);
      res.status(StatusCodes.OK).json(history);
    } catch (error: any) {
      res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    }
  }
}