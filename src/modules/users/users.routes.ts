import { Router } from 'express';
import { UserController } from './users.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { updateUserSchema } from './users.schema.js';

const usersRoutes = Router();
const userController = new UserController();

usersRoutes.use(authMiddleware);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Obter perfil do usuário autenticado
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Perfil do usuário retornado com sucesso
 *       401:
 *         description: Token JWT ausente ou inválido
 */
usersRoutes.get('/me', userController.getProfile);

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Atualizar perfil do usuário autenticado
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "João da Silva"
 *                 description: Nome completo do usuário
 *               phone:
 *                 type: string
 *                 example: "11999999999"
 *                 description: Telefone com DDD
 *               dateOfBirth:
 *                 type: string
 *                 format: date-time
 *                 example: "1990-05-15T00:00:00.000Z"
 *                 description: Data de nascimento no formato ISO 8601
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: "male"
 *                 description: Gênero do usuário
 *               diabetesType:
 *                 type: string
 *                 enum: [type1, type2, gestational, other]
 *                 example: "type1"
 *                 description: Tipo de diabetes
 *               diagnosisYear:
 *                 type: integer
 *                 example: 2015
 *                 description: Ano do diagnóstico
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *       400:
 *         description: Erro de validação dos dados enviados
 *       401:
 *         description: Token JWT ausente ou inválido
 */
usersRoutes.put('/me', validateRequest(updateUserSchema), userController.updateProfile);

/**
 * @swagger
 * /api/users/me:
 *   delete:
 *     summary: Excluir conta do usuário autenticado
 *     tags: [Usuários]
 *     responses:
 *       204:
 *         description: Conta excluída com sucesso
 *       401:
 *         description: Token JWT ausente ou inválido
 */
usersRoutes.delete('/me', userController.deleteAccount);

export default usersRoutes;