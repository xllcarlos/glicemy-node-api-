import { z } from 'zod';

const GenderEnum = z.enum(['male', 'female', 'other']);
const DiabetesEnum = z.enum(['type1', 'type2', 'gestational', 'other']);

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    dateOfBirth: z.string().datetime({ message: 'Formato de data inválido (Use ISO 8601)' }),
    
    // Novos campos adicionados:
    // Se quiser que algum seja opcional para o usuário, basta colocar .optional() no final
    phone: z.string().min(10, 'O telefone deve ter no mínimo 10 dígitos'),
    gender: GenderEnum,
    diabetesType: DiabetesEnum,
    diagnosisYear: z.number()
      .int()
      .min(1900, 'Ano de diagnóstico inválido')
      .max(new Date().getFullYear(), 'O ano de diagnóstico não pode ser no futuro')
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('E-mail inválido'),
    password: z.string().min(1, 'A senha é obrigatória'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('E-mail inválido'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'O token é obrigatório'),
    newPassword: z.string().min(6, 'A nova senha deve ter no mínimo 6 caracteres'),
  }),
});