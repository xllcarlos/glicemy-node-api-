import { Router } from 'express';
import { HeightController } from './height.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createHeightSchema, paramsSchema, updateHeightSchema } from './height.schema.js';

/**
 * @swagger
 * tags:
 *   name: Altura
 *   description: Registro e gerenciamento de medições de altura
 */

const heightRoutes = Router();
const heightController = new HeightController();

heightRoutes.use(authMiddleware);

/**
 * @swagger
 * /api/height:
 *   post:
 *     summary: Criar um novo registro de altura
 *     tags: [Altura]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - heightValue
 *               - measurementDateTime
 *             properties:
 *               heightValue:
 *                 type: number
 *                 example: 170
 *                 description: Altura em centímetros
 *               measurementDateTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-29T09:00:00.000Z"
 *                 description: Data e hora da medição no formato ISO 8601
 *     responses:
 *       201:
 *         description: Registro criado com sucesso
 *       400:
 *         description: Erro de validação dos dados enviados
 *       401:
 *         description: Token JWT ausente ou inválido
 */
heightRoutes.post('/', validateRequest(createHeightSchema), heightController.create);

/**
 * @swagger
 * /api/height:
 *   get:
 *     summary: Listar todos os registros de altura do usuário autenticado
 *     tags: [Altura]
 *     responses:
 *       200:
 *         description: Lista de registros retornada com sucesso
 *       401:
 *         description: Token JWT ausente ou inválido
 */
heightRoutes.get('/', heightController.list);

/**
 * @swagger
 * /api/height/{id}:
 *   get:
 *     summary: Buscar um registro de altura por ID
 *     tags: [Altura]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do registro de altura
 *     responses:
 *       200:
 *         description: Registro retornado com sucesso
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Registro não encontrado
 */
heightRoutes.get('/:id', validateRequest(paramsSchema), heightController.getById);

/**
 * @swagger
 * /api/height/{id}:
 *   put:
 *     summary: Atualizar um registro de altura existente
 *     tags: [Altura]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do registro de altura
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               heightValue:
 *                 type: number
 *                 example: 171
 *                 description: Altura em centímetros
 *               measurementDateTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-29T10:00:00.000Z"
 *                 description: Data e hora da medição no formato ISO 8601
 *     responses:
 *       200:
 *         description: Registro atualizado com sucesso
 *       400:
 *         description: Erro de validação dos dados enviados
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Registro não encontrado
 */
heightRoutes.put('/:id', validateRequest(paramsSchema), validateRequest(updateHeightSchema), heightController.update);

/**
 * @swagger
 * /api/height/{id}:
 *   delete:
 *     summary: Excluir um registro de altura
 *     tags: [Altura]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do registro de altura
 *     responses:
 *       204:
 *         description: Registro excluído com sucesso
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Registro não encontrado
 */
heightRoutes.delete('/:id', validateRequest(paramsSchema), heightController.delete);

export default heightRoutes;