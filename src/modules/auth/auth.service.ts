import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma.js';
import { transporter } from '../../lib/mailer.js';

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

    // NOVO: Atualiza a data do último login do usuário
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    return { user: { id: user.id, name: user.name, email: user.email }, token };
  }

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Se o e-mail existir, um link de recuperação será enviado.'); // Mensagem genérica por segurança

    // Gera um token simples de 6 dígitos (ou poderia ser um UUID)
    const token = Math.floor(100000 + Math.random() * 900000).toString();

    // Expira em 1 hora[cite: 8]
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Salva no banco de dados[cite: 8]
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      }
    });

    // Envia o e-mail
    const info = await transporter.sendMail({
      from: '"Equipe Glicemy" <seu.email.do.projeto@gmail.com>', // 👈 Coloque seu Gmail aqui
      to: user.email,
      subject: 'Recuperação de Senha - Glicemy',
      text: `Olá ${user.name},\n\nSeu código de recuperação é: ${token}`,
      html: `<p>Olá <b>${user.name}</b>,</p><p>Seu código de recuperação é: <h2>${token}</h2></p>`
    });

    // Como estamos usando Ethereal, precisamos logar o link para ver o e-mail no navegador
    import('nodemailer').then((nodemailer) => {
      console.log('🔗 URL do E-mail de Teste: %s', nodemailer.getTestMessageUrl(info));
    });

    return { message: 'Se o e-mail existir, um link de recuperação será enviado.' };
  }

  async resetPassword(data: any) {
    // Busca o token no banco que ainda não foi usado e não expirou[cite: 8]
    const resetRecord = await prisma.passwordResetToken.findFirst({
      where: {
        token: data.token,
        used: false,
        expiresAt: { gt: new Date() }
      }
    });

    if (!resetRecord) throw new Error('Token inválido ou expirado.');

    // Criptografa a nova senha
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(data.newPassword, salt);

    // Atualiza a senha do usuário
    await prisma.user.update({
      where: { id: resetRecord.userId },
      data: { passwordHash: newPasswordHash }
    });

    // Marca o token como usado[cite: 8]
    await prisma.passwordResetToken.update({
      where: { id: resetRecord.id },
      data: { used: true }
    });

    return { message: 'Senha atualizada com sucesso.' };
  }
}