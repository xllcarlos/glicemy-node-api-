import { prisma } from '../../lib/prisma.js';

export class GlucoseService {
  
  // Criar novo registro
  async create(userId: string, data: any) {
    const record = await prisma.glucoseRecord.create({
      data: {
        userId, 
        glucoseValue: data.glucoseValue,
        measurementType: data.measurementType,
        source: data.source || 'manual',
        notes: data.notes,
        measurementDateTime: new Date(data.measurementDateTime),
      },
    });
    return record;
  }

  // Listar todos os registros do usuário
  async findByUser(userId: string) {
    return await prisma.glucoseRecord.findMany({
      where: { userId },
      orderBy: { measurementDateTime: 'desc' },
    });
  }

  // Buscar um registro específico e garantir que pertence ao usuário
  async findById(id: string, userId: string) {
    const record = await prisma.glucoseRecord.findUnique({ where: { id } });
    
    if (!record || record.userId !== userId) {
      throw new Error('Registro não encontrado ou acesso negado');
    }
    return record;
  }

  // Atualizar garantindo a propriedade
  async update(id: string, userId: string, data: any) {
    await this.findById(id, userId); 

    return await prisma.glucoseRecord.update({
      where: { id },
      data: {
        glucoseValue: data.glucoseValue,
        measurementType: data.measurementType,
        source: data.source,
        notes: data.notes,
        measurementDateTime: data.measurementDateTime ? new Date(data.measurementDateTime) : undefined,
      },
    });
  }

  // Deletar garantindo a propriedade
  async delete(id: string, userId: string) {
    await this.findById(id, userId); 

    await prisma.glucoseRecord.delete({
      where: { id },
    });
  }
}