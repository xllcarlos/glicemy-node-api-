import { Router } from 'express';
import { MedicationController } from './medications.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createMedicationSchema, paramsSchema, updateMedicationSchema } from './medications.schema.js';

/**
 * @swagger
 * tags:
 *   name: Medicações
 *   description: Registro e gerenciamento de medicações do usuário
 */

const medicationsRoutes = Router();
const medicationsController = new MedicationController();

medicationsRoutes.use(authMiddleware);

/**
 * @swagger
 * /api/medications:
 *   post:
 *     summary: Cadastrar um novo medicamento
 *     tags: [Medicamentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Metformina"
 *                 description: Nome do medicamento
 *               dosage:
 *                 type: string
 *                 example: "500mg"
 *                 description: Dosagem do medicamento
 *               frequency:
 *                 type: string
 *                 example: "2 vezes ao dia"
 *                 description: Frequência de uso
 *               observations:
 *                 type: string
 *                 example: "Tomar após as refeições"
 *                 description: Observações adicionais
 *     responses:
 *       201:
 *         description: Medicamento criado com sucesso
 *       400:
 *         description: Erro de validação dos dados enviados
 *       401:
 *         description: Token JWT ausente ou inválido
 */
medicationsRoutes.post('/', validateRequest(createMedicationSchema), medicationsController.create);

/**
 * @swagger
 * /api/medications:
 *   get:
 *     summary: Listar todos os medicamentos do usuário autenticado
 *     tags: [Medicamentos]
 *     responses:
 *       200:
 *         description: Lista de medicamentos retornada com sucesso
 *       401:
 *         description: Token JWT ausente ou inválido
 */
medicationsRoutes.get('/', medicationsController.list);

/**
 * @swagger
 * /api/medications/{id}:
 *   get:
 *     summary: Obter um medicamento por ID
 *     tags: [Medicamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do medicamento
 *     responses:
 *       200:
 *         description: Medicamento retornado com sucesso
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Medicamento não encontrado
 */
medicationsRoutes.get('/:id', validateRequest(paramsSchema), medicationsController.getById);

/**
 * @swagger
 * /api/medications/{id}:
 *   put:
 *     summary: Atualizar um medicamento existente
 *     tags: [Medicamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do medicamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Metformina"
 *                 description: Nome do medicamento
 *               dosage:
 *                 type: string
 *                 example: "500mg"
 *                 description: Dosagem do medicamento
 *               frequency:
 *                 type: string
 *                 example: "2 vezes ao dia"
 *                 description: Frequência de uso
 *               observations:
 *                 type: string
 *                 example: "Tomar após as refeições"
 *                 description: Observações adicionais
 *     responses:
 *       200:
 *         description: Medicamento atualizado com sucesso
 *       400:
 *         description: Erro de validação dos dados enviados
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Medicamento não encontrado
 */
medicationsRoutes.put('/:id', validateRequest(paramsSchema), validateRequest(updateMedicationSchema), medicationsController.update);

/**
 * @swagger
 * /api/medications/{id}:
 *   delete:
 *     summary: Excluir um medicamento
 *     tags: [Medicamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do medicamento
 *     responses:
 *       204:
 *         description: Medicamento excluído com sucesso
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Medicamento não encontrado
 */
medicationsRoutes.delete('/:id', validateRequest(paramsSchema), medicationsController.delete);

export default medicationsRoutes;