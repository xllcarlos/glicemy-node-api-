import { prisma } from '../../lib/prisma.js';

// Função auxiliar para converter "HH:MM" no formato Date que o Prisma exige para colunas @db.Time
const parseTime = (timeStr: string) => new Date(`1970-01-01T${timeStr}:00.000Z`);

export class ReminderService {
  async create(userId: string, data: any) {
    return await prisma.reminder.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        type: data.type,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        isActive: data.isActive,
        medicationId: data.medicationId,
        // Criação Aninhada: Salva os horários automaticamente vinculados a este ID
        schedules: {
          create: data.schedules.map((s: any) => ({
            time: parseTime(s.time),
            dayOfWeek: s.dayOfWeek,
          })),
        },
      },
      // Ao criar, já devolve o objeto com seus horários e medicamento (se houver)
      include: {
        schedules: true,
        medication: true,
      },
    });
  }

  async findByUser(userId: string) {
    return await prisma.reminder.findMany({
      where: { userId },
      include: { schedules: true, medication: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, userId: string) {
    const record = await prisma.reminder.findUnique({
      where: { id },
      include: { schedules: true, medication: true },
    });
    if (!record || record.userId !== userId) throw new Error('Acesso negado');
    return record;
  }

  async update(id: string, userId: string, data: any) {
    await this.findById(id, userId); // Segurança

    return await prisma.reminder.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        isActive: data.isActive,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        medicationId: data.medicationId,
        
        // Se novos horários forem enviados, deletamos os antigos e recriamos
        ...(data.schedules && {
          schedules: {
            deleteMany: {}, 
            create: data.schedules.map((s: any) => ({
              time: parseTime(s.time),
              dayOfWeek: s.dayOfWeek,
            })),
          },
        }),
      },
      include: { schedules: true, medication: true },
    });
  }

  async delete(id: string, userId: string) {
    await this.findById(id, userId);
    // Graças ao onDelete: Cascade no banco, deletar o Reminder deleta os Schedules automaticamente
    await prisma.reminder.delete({ where: { id } });
  }
}