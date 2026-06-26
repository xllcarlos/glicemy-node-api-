import { z } from 'zod';

export const createMedicationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'O nome do medicamento é obrigatório'),
    dosage: z.string().min(1, 'A dosagem é obrigatória (ex: 500mg, 1 comprimido)'),
    frequency: z.string().optional(),
    observations: z.string().optional(),
  }),
});

export const paramsSchema = z.object({
  params: z.object({ id: z.string().uuid('ID inválido') }),
});

export const updateMedicationSchema = z.object({
  body: createMedicationSchema.shape.body.partial(),
});