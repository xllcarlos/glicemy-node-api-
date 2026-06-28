import { z } from 'zod';

export const sendMessageSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'A mensagem não pode estar vazia'),
    conversationId: z.string().uuid('ID de conversa inválido').optional(),
  }),
});

export const paramsSchema = z.object({
  params: z.object({ id: z.string().uuid('ID inválido') }),
});