import { Router } from 'express';
import { ReminderController } from './reminders.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createReminderSchema, paramsSchema, updateReminderSchema } from './reminders.schema.js';

/**
 * @swagger
 * tags:
 *   name: Lembretes
 *   description: Registro e gerenciamento de lembretes do usuário
 */

const remindersRoutes = Router();
const remindersController = new ReminderController();

remindersRoutes.use(authMiddleware);

/**
 * @swagger
 * /api/reminders:
 *   post:
 *     summary: Criar um novo lembrete
 *     tags: [Lembretes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - type
 *               - schedules
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Tomar medicação"
 *                 description: Título do lembrete
 *               description:
 *                 type: string
 *                 example: "Tomar insulina antes do jantar"
 *                 description: Descrição opcional do lembrete
 *               type:
 *                 type: string
 *                 enum: [medication, glucose, appointment, meal, general]
 *                 example: "medication"
 *                 description: Tipo do lembrete
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-30T08:00:00.000Z"
 *                 description: Data de início do lembrete
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-07-30T08:00:00.000Z"
 *                 description: Data de término do lembrete
 *               isActive:
 *                 type: boolean
 *                 example: true
 *                 description: Indica se o lembrete está ativo
 *               medicationId:
 *                 type: string
 *                 format: uuid
 *                 example: "d290f1ee-6c54-4b01-90e6-d701748f0851"
 *                 description: Referência opcional de medicamento
 *               schedules:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     time:
 *                       type: string
 *                       example: "08:30"
 *                       description: Horário do lembrete no formato HH:MM
 *                     dayOfWeek:
 *                       type: integer
 *                       example: 1
 *                       description: Dia da semana (1=Domingo, 7=Sábado)
 *                 minItems: 1
 *                 description: Lista de horários agendados para o lembrete
 *     responses:
 *       201:
 *         description: Lembrete criado com sucesso
 *       400:
 *         description: Erro de validação dos dados enviados
 *       401:
 *         description: Token JWT ausente ou inválido
 */
remindersRoutes.post('/', validateRequest(createReminderSchema), remindersController.create);

/**
 * @swagger
 * /api/reminders:
 *   get:
 *     summary: Listar todos os lembretes do usuário autenticado
 *     tags: [Lembretes]
 *     responses:
 *       200:
 *         description: Lista de lembretes retornada com sucesso
 *       401:
 *         description: Token JWT ausente ou inválido
 */
remindersRoutes.get('/', remindersController.list);

/**
 * @swagger
 * /api/reminders/{id}:
 *   get:
 *     summary: Obter um lembrete por ID
 *     tags: [Lembretes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do lembrete
 *     responses:
 *       200:
 *         description: Lembrete retornado com sucesso
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Lembrete não encontrado
 */
remindersRoutes.get('/:id', validateRequest(paramsSchema), remindersController.getById);

/**
 * @swagger
 * /api/reminders/{id}:
 *   put:
 *     summary: Atualizar um lembrete existente
 *     tags: [Lembretes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do lembrete
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Tomar medicação"
 *               description:
 *                 type: string
 *                 example: "Tomar insulina antes do jantar"
 *               type:
 *                 type: string
 *                 enum: [medication, glucose, appointment, meal, general]
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-30T08:00:00.000Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-07-30T08:00:00.000Z"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               medicationId:
 *                 type: string
 *                 format: uuid
 *                 example: "d290f1ee-6c54-4b01-90e6-d701748f0851"
 *               schedules:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     time:
 *                       type: string
 *                       example: "08:30"
 *                     dayOfWeek:
 *                       type: integer
 *                       example: 1
 *     responses:
 *       200:
 *         description: Lembrete atualizado com sucesso
 *       400:
 *         description: Erro de validação dos dados enviados
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Lembrete não encontrado
 */
remindersRoutes.put('/:id', validateRequest(paramsSchema), validateRequest(updateReminderSchema), remindersController.update);

/**
 * @swagger
 * /api/reminders/{id}:
 *   delete:
 *     summary: Excluir um lembrete
 *     tags: [Lembretes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do lembrete
 *     responses:
 *       204:
 *         description: Lembrete excluído com sucesso
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Lembrete não encontrado
 */
remindersRoutes.delete('/:id', validateRequest(paramsSchema), remindersController.delete);

export default remindersRoutes;
