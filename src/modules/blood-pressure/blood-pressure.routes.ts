/**
 * @swagger
 * tags:
 *   name: Pressão Arterial
 *   description: Registro e gerenciamento de medições de pressão arterial
 */
import { Router } from 'express';
import { BloodPressureController } from './blood-pressure.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createBloodPressureSchema, paramsSchema, updateBloodPressureSchema } from './blood-pressure.schema.js';

const bpRoutes = Router();
const bpController = new BloodPressureController();

bpRoutes.use(authMiddleware);

/**
 * @swagger
 * /api/blood-pressure:
 *   post:
 *     summary: Criar um novo registro de pressão arterial
 *     tags: [Pressão Arterial]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - systolic
 *               - diastolic
 *               - measurementDateTime
 *             properties:
 *               systolic:
 *                 type: integer
 *                 example: 120
 *                 description: Pressão sistólica em mmHg
 *               diastolic:
 *                 type: integer
 *                 example: 80
 *                 description: Pressão diastólica em mmHg
 *               pulse:
 *                 type: integer
 *                 example: 72
 *                 description: Frequência cardíaca em batimentos por minuto
 *               notes:
 *                 type: string
 *                 example: "Antes de tomar medicação"
 *                 description: Observações sobre a medição
 *               measurementDateTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-29T09:15:00.000Z"
 *                 description: Data e hora da medição no formato ISO 8601
 *     responses:
 *       201:
 *         description: Registro criado com sucesso
 *       400:
 *         description: Erro de validação dos dados enviados
 *       401:
 *         description: Token JWT ausente ou inválido
 */
bpRoutes.post('/', validateRequest(createBloodPressureSchema), bpController.create);

/**
 * @swagger
 * /api/blood-pressure:
 *   get:
 *     summary: Listar todos os registros de pressão arterial do usuário autenticado
 *     tags: [Pressão Arterial]
 *     responses:
 *       200:
 *         description: Lista de registros retornada com sucesso
 *       401:
 *         description: Token JWT ausente ou inválido
 */
bpRoutes.get('/', bpController.list);

/**
 * @swagger
 * /api/blood-pressure/{id}:
 *   get:
 *     summary: Buscar um registro de pressão arterial por ID
 *     tags: [Pressão Arterial]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do registro de pressão
 *     responses:
 *       200:
 *         description: Registro retornado com sucesso
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Registro não encontrado
 */
bpRoutes.get('/:id', validateRequest(paramsSchema), bpController.getById);

/**
 * @swagger
 * /api/blood-pressure/{id}:
 *   put:
 *     summary: Atualizar um registro de pressão arterial existente
 *     tags: [Pressão Arterial]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do registro de pressão
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               systolic:
 *                 type: integer
 *                 example: 118
 *                 description: Pressão sistólica em mmHg
 *               diastolic:
 *                 type: integer
 *                 example: 78
 *                 description: Pressão diastólica em mmHg
 *               pulse:
 *                 type: integer
 *                 example: 70
 *                 description: Frequência cardíaca em batimentos por minuto
 *               notes:
 *                 type: string
 *                 example: "Após exercício"
 *                 description: Observações sobre a medição
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
bpRoutes.put('/:id', validateRequest(paramsSchema), validateRequest(updateBloodPressureSchema), bpController.update);

/**
 * @swagger
 * /api/blood-pressure/{id}:
 *   delete:
 *     summary: Excluir um registro de pressão arterial
 *     tags: [Pressão Arterial]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do registro de pressão
 *     responses:
 *       204:
 *         description: Registro excluído com sucesso
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Registro não encontrado
 */
bpRoutes.delete('/:id', validateRequest(paramsSchema), bpController.delete);

export default bpRoutes;