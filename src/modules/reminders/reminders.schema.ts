import { z } from 'zod';

const ReminderTypeEnum = z.enum(['medication', 'glucose', 'appointment', 'meal', 'general'], {
  errorMap: () => ({ message: "Tipo de lembrete inválido" })
});

// Validação individual de cada horário enviado
const scheduleSchema = z.object({
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'O horário deve estar no formato HH:MM (ex: 08:30)'),
  dayOfWeek: z.number().int().min(1).max(7, 'Dia da semana deve ser entre 1 (Dom) e 7 (Sáb)').optional(),
});

export const createReminderSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'O título é obrigatório'),
    description: z.string().optional(),
    type: ReminderTypeEnum,
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    isActive: z.boolean().optional().default(true),
    medicationId: z.string().uuid().optional(),
    
    // O lembrete precisa ter pelo menos um horário agendado
    schedules: z.array(scheduleSchema).min(1, 'Adicione pelo menos um horário para o lembrete'),
  }),
});

export const paramsSchema = z.object({
  params: z.object({ id: z.string().uuid('ID inválido') }),
});

export const updateReminderSchema = z.object({
  body: createReminderSchema.shape.body.partial(),
});