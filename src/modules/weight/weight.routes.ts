import { Router } from 'express';
import { WeightController } from './weight.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createWeightSchema, paramsSchema, updateWeightSchema } from './weight.schema.js';

/**
 * @swagger
 * tags:
 *   name: Peso
 *   description: Registro e gerenciamento de medições de peso
 */

const weightRoutes = Router();
const weightController = new WeightController();

weightRoutes.use(authMiddleware);

/**
 * @swagger
 * /api/weight:
 *   post:
 *     summary: Registrar um novo registro de peso
 *     tags: [Peso]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - weightValue
 *               - measurementDateTime
 *             properties:
 *               weightValue:
 *                 type: number
 *                 example: 72.4
 *                 description: Peso em quilogramas
 *               notes:
 *                 type: string
 *                 example: "Após caminhada matinal"
 *                 description: Observações opcionais
 *               measurementDateTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-29T09:00:00.000Z"
 *                 description: Data e hora da medição no formato ISO 8601
 *     responses:
 *       201:
 *         description: Registro de peso criado com sucesso
 *       400:
 *         description: Erro de validação dos dados enviados
 *       401:
 *         description: Token JWT ausente ou inválido
 */
weightRoutes.post('/', validateRequest(createWeightSchema), weightController.create);

/**
 * @swagger
 * /api/weight:
 *   get:
 *     summary: Listar todos os registros de peso do usuário autenticado
 *     tags: [Peso]
 *     responses:
 *       200:
 *         description: Lista de registros retornada com sucesso
 *       401:
 *         description: Token JWT ausente ou inválido
 */
weightRoutes.get('/', weightController.list);

/**
 * @swagger
 * /api/weight/{id}:
 *   get:
 *     summary: Obter um registro de peso por ID
 *     tags: [Peso]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do registro de peso
 *     responses:
 *       200:
 *         description: Registro retornado com sucesso
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Registro não encontrado
 */
weightRoutes.get('/:id', validateRequest(paramsSchema), weightController.getById);

/**
 * @swagger
 * /api/weight/{id}:
 *   put:
 *     summary: Atualizar um registro de peso existente
 *     tags: [Peso]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do registro de peso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               weightValue:
 *                 type: number
 *                 example: 72.4
 *               notes:
 *                 type: string
 *                 example: "Atualizado após exercício"
 *               measurementDateTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-29T09:00:00.000Z"
 *     responses:
 *       200:
 *         description: Registro de peso atualizado com sucesso
 *       400:
 *         description: Erro de validação dos dados enviados
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Registro não encontrado
 */
weightRoutes.put('/:id', validateRequest(paramsSchema), validateRequest(updateWeightSchema), weightController.update);

/**
 * @swagger
 * /api/weight/{id}:
 *   delete:
 *     summary: Excluir um registro de peso
 *     tags: [Peso]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do registro de peso
 *     responses:
 *       204:
 *         description: Registro excluído com sucesso
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Registro não encontrado
 */
weightRoutes.delete('/:id', validateRequest(paramsSchema), weightController.delete);

export default weightRoutes;
