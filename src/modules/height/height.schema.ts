import { z } from 'zod';

export const createHeightSchema = z.object({
  body: z.object({
    heightValue: z.number().positive('A altura deve ser um número positivo'),
    measurementDateTime: z.string().datetime({ message: 'Formato de data/hora inválido' }),
  }),
});

export const paramsSchema = z.object({
  params: z.object({ id: z.string().uuid('ID inválido') }),
});

export const updateHeightSchema = z.object({
  body: createHeightSchema.shape.body.partial(),
});