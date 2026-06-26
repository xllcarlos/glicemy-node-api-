import { z } from 'zod';

export const createWeightSchema = z.object({
  body: z.object({
    weightValue: z.number().positive('O peso deve ser um número positivo'),
    notes: z.string().optional(),
    measurementDateTime: z.string().datetime({ message: 'Formato de data/hora inválido' }),
  }),
});

export const paramsSchema = z.object({
  params: z.object({ id: z.string().uuid('ID inválido') }),
});

export const updateWeightSchema = z.object({
  body: createWeightSchema.shape.body.partial(),
});