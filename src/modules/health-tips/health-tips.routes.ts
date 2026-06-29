import { Router } from 'express';
import { HealthTipsController } from './health-tips.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createHealthTipSchema, paramsSchema, updateHealthTipSchema } from './health-tips.schema.js';

/**
 * @swagger
 * tags:
 *   - name: Dicas de Saúde
 *     description: Gerenciamento e consumo de dicas de saúde
 */

const healthTipsRoutes = Router();
const healthTipsController = new HealthTipsController();

healthTipsRoutes.use(authMiddleware);

/**
 * @swagger
 * /api/health-tips/random:
 *   get:
 *     summary: Retorna 5 dicas de saúde aleatórias ativas (Para consumo do App)
 *     tags: [Dicas de Saúde]
 *     responses:
 *       200:
 *         description: Lista de 5 dicas aleatórias retornada com sucesso
 */
healthTipsRoutes.get('/random', healthTipsController.getRandom);

/**
 * @swagger
 * /api/health-tips:
 *   post:
 *     summary: Criar uma nova dica de saúde
 *     tags: [Dicas de Saúde]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Beber mais água"
 *               content:
 *                 type: string
 *                 example: "Beba pelo menos 8 copos de água por dia."
 *               category:
 *                 type: string
 *                 enum: [nutrition, physical_activity, medication, monitoring, prevention, general]
 *                 example: "nutrition"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Dica criada com sucesso
 */
healthTipsRoutes.post('/', validateRequest(createHealthTipSchema), healthTipsController.create);

/**
 * @swagger
 * /api/health-tips:
 *   get:
 *     summary: Listar todas as dicas de saúde cadastradas
 *     tags: [Dicas de Saúde]
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 */
healthTipsRoutes.get('/', healthTipsController.list);

/**
 * @swagger
 * /api/health-tips/{id}:
 *   get:
 *     summary: Buscar uma dica de saúde por ID
 *     tags: [Dicas de Saúde]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da dica de saúde
 *     responses:
 *       200:
 *         description: Dica retornada com sucesso
 */
healthTipsRoutes.get('/:id', validateRequest(paramsSchema), healthTipsController.getById);

/**
 * @swagger
 * /api/health-tips/{id}:
 *   put:
 *     summary: Atualizar uma dica de saúde existente
 *     tags: [Dicas de Saúde]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da dica de saúde
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Dica atualizada com sucesso
 */
healthTipsRoutes.put('/:id', validateRequest(paramsSchema), validateRequest(updateHealthTipSchema), healthTipsController.update);

/**
 * @swagger
 * /api/health-tips/{id}:
 *   delete:
 *     summary: Excluir uma dica de saúde
 *     tags: [Dicas de Saúde]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da dica de saúde
 *     responses:
 *       204:
 *         description: Dica excluída com sucesso
 */
healthTipsRoutes.delete('/:id', validateRequest(paramsSchema), healthTipsController.delete);

export default healthTipsRoutes;