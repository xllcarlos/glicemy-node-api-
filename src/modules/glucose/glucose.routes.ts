import { Router } from 'express';
import { GlucoseController } from './glucose.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createGlucoseSchema, paramsSchema, updateGlucoseSchema } from './glucose.schema.js';

/**
 * @swagger
 * tags:
 *   name: Glicemia
 *   description: Registro e gerenciamento de medições de glicose
 */
const glucoseRoutes = Router();
const glucoseController = new GlucoseController();

// Todas as rotas abaixo requerem o Token JWT
glucoseRoutes.use(authMiddleware);

/**
 * @swagger
 * /api/glucose:
 *   post:
 *     summary: Criar um novo registro de glicemia
 *     tags: [Glicemia]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - glucoseValue
 *               - measurementType
 *               - measurementDateTime
 *             properties:
 *               glucoseValue:
 *                 type: number
 *                 example: 98
 *                 description: Valor da glicose em mg/dL
 *               measurementType:
 *                 type: string
 *                 enum: [fasting, pre_meal, post_meal, before_bed, overnight, random]
 *                 example: fasting
 *                 description: Tipo de medição
 *               source:
 *                 type: string
 *                 example: "glucometer"
 *                 description: Fonte do registro
 *               notes:
 *                 type: string
 *                 example: "Antes do café"
 *                 description: Observações adicionais
 *               measurementDateTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-29T08:30:00.000Z"
 *                 description: Data e hora da medição no formato ISO 8601
 *     responses:
 *       201:
 *         description: Registro criado com sucesso
 *       400:
 *         description: Erro de validação dos dados enviados
 *       401:
 *         description: Token JWT ausente ou inválido
 */
glucoseRoutes.post('/', validateRequest(createGlucoseSchema), glucoseController.create);

/**
 * @swagger
 * /api/glucose:
 *   get:
 *     summary: Listar todos os registros de glicemia do usuário autenticado
 *     tags: [Glicemia]
 *     responses:
 *       200:
 *         description: Lista de registros retornada com sucesso
 *       401:
 *         description: Token JWT ausente ou inválido
 */
glucoseRoutes.get('/', glucoseController.list);

/**
 * @swagger
 * /api/glucose/{id}:
 *   get:
 *     summary: Buscar um registro de glicemia por ID
 *     tags: [Glicemia]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do registro de glicose
 *     responses:
 *       200:
 *         description: Registro retornado com sucesso
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Registro não encontrado
 */
glucoseRoutes.get('/:id', validateRequest(paramsSchema), glucoseController.getById);

/**
 * @swagger
 * /api/glucose/{id}:
 *   put:
 *     summary: Atualizar um registro de glicemia existente
 *     tags: [Glicemia]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do registro de glicose
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               glucoseValue:
 *                 type: number
 *                 example: 110
 *                 description: Valor da glicose em mg/dL
 *               measurementType:
 *                 type: string
 *                 enum: [fasting, pre_meal, post_meal, before_bed, overnight, random]
 *                 example: pre_meal
 *                 description: Tipo de medição
 *               source:
 *                 type: string
 *                 example: "glucometer"
 *                 description: Fonte do registro
 *               notes:
 *                 type: string
 *                 example: "Após exercício"
 *                 description: Observações adicionais
 *               measurementDateTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-29T12:00:00.000Z"
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
glucoseRoutes.put('/:id', 
  validateRequest(paramsSchema), 
  validateRequest(updateGlucoseSchema), 
  glucoseController.update
);

/**
 * @swagger
 * /api/glucose/{id}:
 *   delete:
 *     summary: Excluir um registro de glicemia
 *     tags: [Glicemia]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do registro de glicose
 *     responses:
 *       204:
 *         description: Registro excluído com sucesso
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Registro não encontrado
 */
glucoseRoutes.delete('/:id', validateRequest(paramsSchema), glucoseController.delete);

export default glucoseRoutes;