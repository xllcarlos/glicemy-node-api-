import { z } from 'zod';

const MeasurementTypeEnum = z.enum([
  'fasting', 'pre_meal', 'post_meal', 'before_bed', 'overnight', 'random'
]);

export const createGlucoseSchema = z.object({
  body: z.object({
    glucoseValue: z.number().positive('O valor da glicose deve ser positivo'),
    measurementType: MeasurementTypeEnum,
    source: z.string().optional(),
    notes: z.string().optional(),
    measurementDateTime: z.string().datetime({ message: 'Formato de data/hora inválido (Use ISO 8601)' }),
  }),
});

// Valida se o ID passado na URL é um UUID válido
export const paramsSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
});

// Para o Update, todos os campos do body tornam-se opcionais
export const updateGlucoseSchema = z.object({
  body: createGlucoseSchema.shape.body.partial(),
});