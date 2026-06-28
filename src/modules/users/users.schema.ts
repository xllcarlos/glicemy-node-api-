import { z } from 'zod';

const GenderEnum = z.enum(['male', 'female', 'other']);
const DiabetesEnum = z.enum(['type1', 'type2', 'gestational', 'other']);

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres').optional(),
    phone: z.string().min(10, 'O telefone deve ter no mínimo 10 dígitos').optional(),
    dateOfBirth: z.string().datetime().optional(),
    gender: GenderEnum.optional(),
    diabetesType: DiabetesEnum.optional(),
    diagnosisYear: z.number().int().min(1900).max(new Date().getFullYear()).optional()
  }),
});