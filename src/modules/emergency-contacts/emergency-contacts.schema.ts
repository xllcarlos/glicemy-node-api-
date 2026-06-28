import { z } from 'zod';

export const createContactSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'O nome é obrigatório'),
    phone: z.string().min(8, 'O telefone é obrigatório'),
    email: z.string().email('E-mail inválido').optional().or(z.literal('')),
    relationship: z.string().optional(),
    isPrimary: z.boolean().optional(),
    canReceiveSMS: z.boolean().optional(),
    canReceiveCalls: z.boolean().optional(),
  }),
});

export const paramsSchema = z.object({
  params: z.object({ id: z.string().uuid('ID inválido') }),
});

export const updateContactSchema = z.object({
  body: createContactSchema.shape.body.partial(),
});