import { prisma } from '../../lib/prisma.js';

export class HbA1cService {
  async create(userId: string, data: any) {
    return await prisma.hbA1cRecord.create({
      data: {
        userId,
        hba1cValue: data.hba1cValue,
        notes: data.notes,
        measurementDate: new Date(data.measurementDate),
      },
    });
  }

  async findByUser(userId: string) {
    return await prisma.hbA1cRecord.findMany({
      where: { userId },
      orderBy: { measurementDate: 'desc' },
    });
  }

  async findById(id: string, userId: string) {
    const record = await prisma.hbA1cRecord.findUnique({ where: { id } });
    if (!record || record.userId !== userId) throw new Error('Acesso negado');
    return record;
  }

  async update(id: string, userId: string, data: any) {
    await this.findById(id, userId);
    return await prisma.hbA1cRecord.update({
      where: { id },
      data: {
        hba1cValue: data.hba1cValue,
        notes: data.notes,
        measurementDate: data.measurementDate ? new Date(data.measurementDate) : undefined,
      },
    });
  }

  async delete(id: string, userId: string) {
    await this.findById(id, userId);
    await prisma.hbA1cRecord.delete({ where: { id } });
  }
}