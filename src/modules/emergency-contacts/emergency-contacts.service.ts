import { prisma } from '../../lib/prisma.js';

export class EmergencyContactService {
  async create(userId: string, data: any) {
    return await prisma.emergencyContact.create({
      data: {
        userId,
        name: data.name,
        phone: data.phone,
        email: data.email,
        relationship: data.relationship,
        isPrimary: data.isPrimary,
        canReceiveSMS: data.canReceiveSMS,
        canReceiveCalls: data.canReceiveCalls,
      },
    });
  }

  async findByUser(userId: string) {
    return await prisma.emergencyContact.findMany({
      where: { userId },
      orderBy: { isPrimary: 'desc' }, // Traz os contatos primários primeiro
    });
  }

  async findById(id: string, userId: string) {
    const record = await prisma.emergencyContact.findUnique({ where: { id } });
    if (!record || record.userId !== userId) throw new Error('Acesso negado');
    return record;
  }

  async update(id: string, userId: string, data: any) {
    await this.findById(id, userId);
    return await prisma.emergencyContact.update({
      where: { id },
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        relationship: data.relationship,
        isPrimary: data.isPrimary,
        canReceiveSMS: data.canReceiveSMS,
        canReceiveCalls: data.canReceiveCalls,
      },
    });
  }

  async delete(id: string, userId: string) {
    await this.findById(id, userId);
    await prisma.emergencyContact.delete({ where: { id } });
  }
}