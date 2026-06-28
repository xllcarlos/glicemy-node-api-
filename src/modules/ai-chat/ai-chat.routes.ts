import { Router } from 'express';
import { AiChatController } from './ai-chat.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { sendMessageSchema, paramsSchema } from './ai-chat.schema.js';

const aiChatRoutes = Router();
const aiChatController = new AiChatController();

aiChatRoutes.use(authMiddleware);
aiChatRoutes.post('/send', validateRequest(sendMessageSchema), aiChatController.sendMessage);
aiChatRoutes.get('/conversations', aiChatController.listConversations);
aiChatRoutes.get('/conversations/:id', validateRequest(paramsSchema), aiChatController.getHistory);

export default aiChatRoutes;