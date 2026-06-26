import { prisma } from '../../lib/prisma.js';

export class WeightService {
  async create(userId: string, data: any) {
    return await prisma.weightRecord.create({
      data: {
        userId,
        weightValue: data.weightValue,
        notes: data.notes,
        measurementDateTime: new Date(data.measurementDateTime),
      },
    });
  }

  async findByUser(userId: string) {
    return await prisma.weightRecord.findMany({
      where: { userId },
      orderBy: { measurementDateTime: 'desc' },
    });
  }

  async findById(id: string, userId: string) {
    const record = await prisma.weightRecord.findUnique({ where: { id } });
    if (!record || record.userId !== userId) throw new Error('Acesso negado');
    return record;
  }

  async update(id: string, userId: string, data: any) {
    await this.findById(id, userId);
    return await prisma.weightRecord.update({
      where: { id },
      data: {
        weightValue: data.weightValue,
        notes: data.notes,
        measurementDateTime: data.measurementDateTime ? new Date(data.measurementDateTime) : undefined,
      },
    });
  }

  async delete(id: string, userId: string) {
    await this.findById(id, userId);
    await prisma.weightRecord.delete({ where: { id } });
  }
}