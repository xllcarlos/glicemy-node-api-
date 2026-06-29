
import { Router } from 'express';
import { HbA1cController } from './hba1c.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createHbA1cSchema, paramsSchema, updateHbA1cSchema } from './hba1c.schema.js';

/**
 * @swagger
 * tags:
 *   name: HbA1c
 *   description: Registro e gerenciamento de exames de HbA1c
 */

const hba1cRoutes = Router();
const hba1cController = new HbA1cController();

hba1cRoutes.use(authMiddleware);

/**
 * @swagger
 * /api/hba1c:
 *   post:
 *     summary: Criar um novo registro de HbA1c
 *     tags: [HbA1c]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hba1cValue
 *               - measurementDate
 *             properties:
 *               hba1cValue:
 *                 type: number
 *                 example: 6.2
 *                 description: Valor do exame HbA1c
 *               notes:
 *                 type: string
 *                 example: "Medição antes do café da manhã"
 *                 description: Observações sobre o exame
 *               measurementDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-29T08:00:00.000Z"
 *                 description: Data e hora em que a amostra foi coletada
 *     responses:
 *       201:
 *         description: Registro criado com sucesso
 *       400:
 *         description: Erro de validação dos dados enviados
 *       401:
 *         description: Token JWT ausente ou inválido
 */
hba1cRoutes.post('/', validateRequest(createHbA1cSchema), hba1cController.create);

/**
 * @swagger
 * /api/hba1c:
 *   get:
 *     summary: Listar todos os registros de HbA1c do usuário autenticado
 *     tags: [HbA1c]
 *     responses:
 *       200:
 *         description: Lista de registros retornada com sucesso
 *       401:
 *         description: Token JWT ausente ou inválido
 */
hba1cRoutes.get('/', hba1cController.list);

/**
 * @swagger
 * /api/hba1c/{id}:
 *   get:
 *     summary: Buscar um registro de HbA1c por ID
 *     tags: [HbA1c]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do registro de HbA1c
 *     responses:
 *       200:
 *         description: Registro retornado com sucesso
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Registro não encontrado
 */
hba1cRoutes.get('/:id', validateRequest(paramsSchema), hba1cController.getById);

/**
 * @swagger
 * /api/hba1c/{id}:
 *   put:
 *     summary: Atualizar um registro de HbA1c existente
 *     tags: [HbA1c]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do registro de HbA1c
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hba1cValue:
 *                 type: number
 *                 example: 6.0
 *                 description: Valor do exame HbA1c
 *               notes:
 *                 type: string
 *                 example: "Acompanhamento do tratamento"
 *                 description: Observações sobre o exame
 *               measurementDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-29T08:00:00.000Z"
 *                 description: Data e hora em que a amostra foi coletada
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
hba1cRoutes.put('/:id', validateRequest(paramsSchema), validateRequest(updateHbA1cSchema), hba1cController.update);

/**
 * @swagger
 * /api/hba1c/{id}:
 *   delete:
 *     summary: Excluir um registro de HbA1c
 *     tags: [HbA1c]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do registro de HbA1c
 *     responses:
 *       204:
 *         description: Registro excluído com sucesso
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Registro não encontrado
 */
hba1cRoutes.delete('/:id', validateRequest(paramsSchema), hba1cController.delete);

export default hba1cRoutes;
