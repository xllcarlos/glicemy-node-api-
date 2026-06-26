import { prisma } from '../../lib/prisma.js';

export class BloodPressureService {
  async create(userId: string, data: any) {
    return await prisma.bloodPressureRecord.create({
      data: {
        userId,
        systolic: data.systolic,
        diastolic: data.diastolic,
        pulse: data.pulse,
        notes: data.notes,
        measurementDateTime: new Date(data.measurementDateTime),
      },
    });
  }

  async findByUser(userId: string) {
    return await prisma.bloodPressureRecord.findMany({
      where: { userId },
      orderBy: { measurementDateTime: 'desc' },
    });
  }

  async findById(id: string, userId: string) {
    const record = await prisma.bloodPressureRecord.findUnique({ where: { id } });
    if (!record || record.userId !== userId) {
      throw new Error('Registro não encontrado ou acesso negado');
    }
    return record;
  }

  async update(id: string, userId: string, data: any) {
    await this.findById(id, userId);

    return await prisma.bloodPressureRecord.update({
      where: { id },
      data: {
        systolic: data.systolic,
        diastolic: data.diastolic,
        pulse: data.pulse,
        notes: data.notes,
        measurementDateTime: data.measurementDateTime ? new Date(data.measurementDateTime) : undefined,
      },
    });
  }

  async delete(id: string, userId: string) {
    await this.findById(id, userId);
    await prisma.bloodPressureRecord.delete({ where: { id } });
  }
}