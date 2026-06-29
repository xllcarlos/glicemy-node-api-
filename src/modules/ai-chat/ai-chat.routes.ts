/**
 * @swagger
 * tags:
 *   name: Chat IA
 *   description: Comunicação e histórico de conversas com o assistente de IA
 */
import { Router } from 'express';
import { AiChatController } from './ai-chat.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { sendMessageSchema, paramsSchema } from './ai-chat.schema.js';

const aiChatRoutes = Router();
const aiChatController = new AiChatController();

aiChatRoutes.use(authMiddleware);

/**
 * @swagger
 * /api/ai-chat/send:
 *   post:
 *     summary: Enviar mensagem para o assistente de IA
 *     tags: [Chat IA]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Qual é a melhor hora para medir minha glicose?"
 *                 description: Texto da mensagem enviada ao assistente de IA
 *               conversationId:
 *                 type: string
 *                 format: uuid
 *                 example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *                 description: ID da conversa existente, se aplicável
 *     responses:
 *       200:
 *         description: Mensagem processada com sucesso e resposta retornada
 *       400:
 *         description: Erro de validação dos dados enviados
 *       401:
 *         description: Token JWT ausente ou inválido
 */
aiChatRoutes.post('/send', validateRequest(sendMessageSchema), aiChatController.sendMessage);

/**
 * @swagger
 * /api/ai-chat/conversations:
 *   get:
 *     summary: Listar conversas do usuário autenticado
 *     tags: [Chat IA]
 *     responses:
 *       200:
 *         description: Lista de conversas retornada com sucesso
 *       401:
 *         description: Token JWT ausente ou inválido
 */
aiChatRoutes.get('/conversations', aiChatController.listConversations);

/**
 * @swagger
 * /api/ai-chat/conversations/{id}:
 *   get:
 *     summary: Obter histórico de mensagens de uma conversa
 *     tags: [Chat IA]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da conversa
 *     responses:
 *       200:
 *         description: Histórico da conversa retornado com sucesso
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Conversa não encontrada
 */
aiChatRoutes.get('/conversations/:id', validateRequest(paramsSchema), aiChatController.getHistory);

export default aiChatRoutes;