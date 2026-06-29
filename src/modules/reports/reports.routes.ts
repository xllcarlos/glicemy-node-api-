import { Router } from 'express';
import { ReportController } from './reports.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

/**
 * @swagger
 * tags:
 *   name: Relatórios
 *   description: Registro e gerenciamento de relatórios de saúde
 */

const reportsRoutes = Router();
const reportController = new ReportController();

reportsRoutes.use(authMiddleware);

/**
 * @swagger
 * /api/reports/download:
 *   get:
 *     summary: Baixar relatório de saúde do usuário
 *     tags: [Relatórios]
 *     responses:
 *       200:
 *         description: Relatório gerado e enviado como arquivo para download
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Token JWT ausente ou inválido
 *       403:
 *         description: Acesso negado
 */
reportsRoutes.get('/download', reportController.downloadReport);

/**
 * @swagger
 * /api/reports/send-email:
 *   post:
 *     summary: Enviar relatório por e-mail
 *     tags: [Relatórios]
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
 *                 example: "usuario@exemplo.com"
 *                 description: E-mail do destinatário
 *               reportType:
 *                 type: string
 *                 example: "monthly"
 *                 description: Tipo de relatório ou período desejado
 *               message:
 *                 type: string
 *                 example: "Por favor, envie meu relatório do mês atual."
 *                 description: Mensagem opcional no corpo do e-mail
 *     responses:
 *       200:
 *         description: Relatório enviado por e-mail com sucesso
 *       400:
 *         description: Erro de validação dos dados enviados
 *       401:
 *         description: Token JWT ausente ou inválido
 *       403:
 *         description: Acesso negado
 */
reportsRoutes.post('/send-email', reportController.sendEmail);

export default reportsRoutes;
