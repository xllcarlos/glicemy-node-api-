import { z } from 'zod';

export const createBloodPressureSchema = z.object({
  body: z.object({
    systolic: z.number().int().positive('A pressão sistólica deve ser um número inteiro positivo'),
    diastolic: z.number().int().positive('A pressão diastólica deve ser um número inteiro positivo'),
    pulse: z.number().int().positive().optional(),
    notes: z.string().optional(),
    measurementDateTime: z.string().datetime({ message: 'Formato de data/hora inválido (Use ISO 8601)' }),
  }),
});

export const paramsSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
});

export const updateBloodPressureSchema = z.object({
  body: createBloodPressureSchema.shape.body.partial(),
});