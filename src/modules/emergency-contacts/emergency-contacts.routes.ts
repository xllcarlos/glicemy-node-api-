/**
 * @swagger
 * tags:
 *   name: Contatos de Emergência
 *   description: Gerenciamento de contatos de emergência do usuário
 */
import { Router } from 'express';
import { EmergencyContactController } from './emergency-contacts.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createContactSchema, paramsSchema, updateContactSchema } from './emergency-contacts.schema.js';

const contactsRoutes = Router();
const contactController = new EmergencyContactController();

contactsRoutes.use(authMiddleware);

/**
 * @swagger
 * /api/emergency-contacts:
 *   post:
 *     summary: Criar um novo contato de emergência
 *     tags: [Contatos de Emergência]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Maria Silva"
 *                 description: Nome do contato de emergência
 *               phone:
 *                 type: string
 *                 example: "11999999999"
 *                 description: Telefone do contato
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "maria@email.com"
 *                 description: E-mail do contato
 *               relationship:
 *                 type: string
 *                 example: "Esposa"
 *                 description: Relação com o usuário
 *               isPrimary:
 *                 type: boolean
 *                 example: true
 *                 description: Indica se é o contato principal
 *               canReceiveSMS:
 *                 type: boolean
 *                 example: true
 *                 description: Se pode receber SMS
 *               canReceiveCalls:
 *                 type: boolean
 *                 example: true
 *                 description: Se pode receber chamadas
 *     responses:
 *       201:
 *         description: Contato criado com sucesso
 *       400:
 *         description: Erro de validação dos dados enviados
 *       401:
 *         description: Token JWT ausente ou inválido
 */
contactsRoutes.post('/', validateRequest(createContactSchema), contactController.create);

/**
 * @swagger
 * /api/emergency-contacts:
 *   get:
 *     summary: Listar contatos de emergência do usuário autenticado
 *     tags: [Contatos de Emergência]
 *     responses:
 *       200:
 *         description: Lista de contatos retornada com sucesso
 *       401:
 *         description: Token JWT ausente ou inválido
 */
contactsRoutes.get('/', contactController.list);

/**
 * @swagger
 * /api/emergency-contacts/{id}:
 *   get:
 *     summary: Buscar um contato de emergência por ID
 *     tags: [Contatos de Emergência]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do contato de emergência
 *     responses:
 *       200:
 *         description: Contato retornado com sucesso
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Contato não encontrado
 */
contactsRoutes.get('/:id', validateRequest(paramsSchema), contactController.getById);

/**
 * @swagger
 * /api/emergency-contacts/{id}:
 *   put:
 *     summary: Atualizar um contato de emergência existente
 *     tags: [Contatos de Emergência]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do contato de emergência
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Maria Silva"
 *                 description: Nome do contato de emergência
 *               phone:
 *                 type: string
 *                 example: "11999999999"
 *                 description: Telefone do contato
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "maria@email.com"
 *                 description: E-mail do contato
 *               relationship:
 *                 type: string
 *                 example: "Esposa"
 *                 description: Relação com o usuário
 *               isPrimary:
 *                 type: boolean
 *                 example: true
 *                 description: Indica se é o contato principal
 *               canReceiveSMS:
 *                 type: boolean
 *                 example: true
 *                 description: Se pode receber SMS
 *               canReceiveCalls:
 *                 type: boolean
 *                 example: true
 *                 description: Se pode receber chamadas
 *     responses:
 *       200:
 *         description: Contato atualizado com sucesso
 *       400:
 *         description: Erro de validação dos dados enviados
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Contato não encontrado
 */
contactsRoutes.put('/:id', validateRequest(paramsSchema), validateRequest(updateContactSchema), contactController.update);

/**
 * @swagger
 * /api/emergency-contacts/{id}:
 *   delete:
 *     summary: Excluir um contato de emergência
 *     tags: [Contatos de Emergência]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do contato de emergência
 *     responses:
 *       204:
 *         description: Contato excluído com sucesso
 *       401:
 *         description: Token JWT ausente ou inválido
 *       404:
 *         description: Contato não encontrado
 */
contactsRoutes.delete('/:id', validateRequest(paramsSchema), contactController.delete);

export default contactsRoutes;