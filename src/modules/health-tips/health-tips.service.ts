import { prisma } from '../../lib/prisma.js';
import { HealthTip } from '@prisma/client';

export class HealthTipsService {
  async create(data: any) {
    return await prisma.healthTip.create({
      data: {
        title: data.title,
        content: data.content,
        category: data.category,
        isActive: data.isActive ?? true,
      },
    });
  }

  async findAll() {
    return await prisma.healthTip.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // Lógica específica para o aplicativo consumir dicas aleatórias
  async findRandomAppTips(): Promise<HealthTip[]> {
    // Retorna 5 registros aleatórios do Postgres que estejam ativos
    return await prisma.$queryRaw<HealthTip[]>`
      SELECT * FROM "HealthTip" 
      WHERE "isActive" = true 
      ORDER BY RANDOM() 
      LIMIT 5;
    `;
  }

  async findById(id: string) {
    const record = await prisma.healthTip.findUnique({ where: { id } });
    if (!record) throw new Error('Dica de saúde não encontrada');
    return record;
  }

  async update(id: string, data: any) {
    await this.findById(id); // Valida se existe
    return await prisma.healthTip.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        category: data.category,
        isActive: data.isActive,
      },
    });
  }

  async delete(id: string) {
    await this.findById(id); // Valida se existe
    await prisma.healthTip.delete({ where: { id } });
  }
}