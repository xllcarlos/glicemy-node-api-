import { z } from 'zod';

export const createHbA1cSchema = z.object({
  body: z.object({
    hba1cValue: z.number().positive('O valor deve ser positivo'),
    notes: z.string().optional(),
    measurementDate: z.string().datetime({ message: 'Formato de data inválido' }),
  }),
});

export const paramsSchema = z.object({
  params: z.object({ id: z.string().uuid('ID inválido') }),
});

export const updateHbA1cSchema = z.object({
  body: createHbA1cSchema.shape.body.partial(),
});