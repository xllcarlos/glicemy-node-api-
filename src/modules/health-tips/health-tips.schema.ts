import { z } from 'zod';

const healthTipCategoryEnum = z.enum([
  'nutrition',
  'physical_activity',
  'medication',
  'monitoring',
  'prevention',
  'general',
]);

export const createHealthTipSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres').max(255),
    content: z.string().min(10, 'O conteúdo deve ter pelo menos 10 caracteres'),
    category: healthTipCategoryEnum,
    isActive: z.boolean().optional(),
  }),
});

export const paramsSchema = z.object({
  params: z.object({ id: z.string().uuid('ID inválido') }),
});

export const updateHealthTipSchema = z.object({
  body: createHealthTipSchema.shape.body.partial(),
});