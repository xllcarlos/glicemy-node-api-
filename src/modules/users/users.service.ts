import { prisma } from '../../lib/prisma.js';

export class UserService {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, email: true, phone: true,
        dateOfBirth: true, gender: true, diabetesType: true,
        diagnosisYear: true, createdAt: true, lastLoginAt: true
      }
    });
    if (!user) throw new Error('Usuário não encontrado');
    return user;
  }

  async updateProfile(userId: string, data: any) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        gender: data.gender,
        diabetesType: data.diabetesType,
        diagnosisYear: data.diagnosisYear,
      },
      select: { id: true, name: true, email: true, phone: true }
    });
  }

  async deleteAccount(userId: string) {
    // O onDelete: Cascade no banco apagará todos os registros associados
    await prisma.user.delete({ where: { id: userId } });
  }
}