import { prisma } from '../../lib/prisma.js';

export class HeightService {
  async create(userId: string, data: any) {
    return await prisma.heightRecord.create({
      data: {
        userId,
        heightValue: data.heightValue,
        measurementDateTime: new Date(data.measurementDateTime),
      },
    });
  }

  async findByUser(userId: string) {
    return await prisma.heightRecord.findMany({
      where: { userId },
      orderBy: { measurementDateTime: 'desc' },
    });
  }

  async findById(id: string, userId: string) {
    const record = await prisma.heightRecord.findUnique({ where: { id } });
    if (!record || record.userId !== userId) throw new Error('Acesso negado');
    return record;
  }

  async update(id: string, userId: string, data: any) {
    await this.findById(id, userId);
    return await prisma.heightRecord.update({
      where: { id },
      data: {
        heightValue: data.heightValue,
        measurementDateTime: data.measurementDateTime ? new Date(data.measurementDateTime) : undefined,
      },
    });
  }

  async delete(id: string, userId: string) {
    await this.findById(id, userId);
    await prisma.heightRecord.delete({ where: { id } });
  }
}