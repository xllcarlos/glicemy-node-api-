import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma.js';

export class AuthService {
  async register(data: any) {
    // 1. Verifica se o e-mail já existe
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new Error('E-mail já está em uso.');
    }

    // 2. Cria o Hash da senha
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    // 3. Salva no banco de dados
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        dateOfBirth: new Date(data.dateOfBirth),

        // Mapeando os novos campos
        phone: data.phone,
        gender: data.gender,
        diabetesType: data.diabetesType,
        diagnosisYear: data.diagnosisYear,
      },
      // Vamos retornar os dados novos para confirmar que salvou
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        gender: true,
        diabetesType: true,
        diagnosisYear: true
      }
    });

    return user;
  }

  async login(data: any) {
    // 1. Busca o usuário
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw new Error('Credenciais inválidas.');

    // 2. Compara a senha
    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isPasswordValid) throw new Error('Credenciais inválidas.');

    // 3. Gera o Token JWT
    const secret = process.env.JWT_SECRET || 'glicemy_tcc_secret_key_super_segura';
    const token = jwt.sign({ id: user.id, email: user.email }, secret, {
      expiresIn: '7d',
    });

    // 4. Salva a sessão no banco
    await prisma.userSession.create({
      data: {
        userId: user.id,
        refreshToken: token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    // 👉 NOVO: Atualiza a data do último login do usuário
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    return { user: { id: user.id, name: user.name, email: user.email }, token };
  }
}