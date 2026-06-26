import { prisma } from '../../lib/prisma.js';

export class MedicationService {
  async create(userId: string, data: any) {
    return await prisma.medication.create({
      data: {
        userId,
        name: data.name,
        dosage: data.dosage,
        frequency: data.frequency,
        observations: data.observations,
      },
    });
  }

  async findByUser(userId: string) {
    return await prisma.medication.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, userId: string) {
    const record = await prisma.medication.findUnique({ where: { id } });
    if (!record || record.userId !== userId) throw new Error('Acesso negado ou registro não encontrado');
    return record;
  }

  async update(id: string, userId: string, data: any) {
    await this.findById(id, userId);
    return await prisma.medication.update({
      where: { id },
      data: {
        name: data.name,
        dosage: data.dosage,
        frequency: data.frequency,
        observations: data.observations,
      },
    });
  }

  async delete(id: string, userId: string) {
    await this.findById(id, userId);
    await prisma.medication.delete({ where: { id } });
  }
}