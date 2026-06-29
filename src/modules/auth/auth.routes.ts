import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from './auth.schema.js';

const authRoutes = Router();
const authController = new AuthController();

/**
 * @swagger
 * tags:
 *   - name: Autenticação
 *     description: Gerenciamento de usuários, registro e login
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar um novo usuário
 *     tags: [Autenticação]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - dateOfBirth
 *               - phone
 *               - gender
 *               - diabetesType
 *               - diagnosisYear
 *             properties:
 *               name:
 *                 type: string
 *                 example: "João da Silva"
 *                 description: "O nome deve ter no mínimo 3 caracteres"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "joao@email.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "senhaSegura123"
 *                 description: "A senha deve ter no mínimo 6 caracteres"
 *               dateOfBirth:
 *                 type: string
 *                 format: date-time
 *                 example: "1990-05-15T00:00:00.000Z"
 *                 description: "Data de nascimento no formato ISO 8601"
 *               phone:
 *                 type: string
 *                 example: "11999999999"
 *                 description: "Telefone com DDD (mínimo 10 dígitos)"
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: "male"
 *               diabetesType:
 *                 type: string
 *                 enum: [type1, type2, gestational, other]
 *                 example: "type1"
 *               diagnosisYear:
 *                 type: integer
 *                 example: 2015
 *                 description: "Ano do diagnóstico (ex: 2015)"
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Erro de validação dos dados enviados
 *       409:
 *         description: E-mail já cadastrado
 */
authRoutes.post('/register', validateRequest(registerSchema), authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Realizar login na aplicação
 *     tags: [Autenticação]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "joao@email.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "senhaSegura123"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticação nas rotas protegidas
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Credenciais inválidas (E-mail ou senha incorretos)
 */
authRoutes.post('/login', validateRequest(loginSchema), authController.login);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Solicitar recuperação de senha
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "joao@email.com"
 *     responses:
 *       200:
 *         description: Instruções de recuperação enviadas para o e-mail (se existir)
 *       400:
 *         description: Erro de validação
 */
authRoutes.post('/forgot-password', validateRequest(forgotPasswordSchema), authController.forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Redefinir a senha do usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token recebido por e-mail para autorizar a redefinição
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: "novaSenhaSuperSegura123"
 *                 description: "A nova senha (mínimo de 6 caracteres)"
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *       400:
 *         description: Token inválido, expirado ou erro de validação
 */
authRoutes.post('/reset-password', validateRequest(resetPasswordSchema), authController.resetPassword);

export default authRoutes;