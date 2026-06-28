import { Router } from 'express';
import { EmergencyContactController } from './emergency-contacts.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createContactSchema, paramsSchema, updateContactSchema } from './emergency-contacts.schema.js';

const contactsRoutes = Router();
const contactController = new EmergencyContactController();

contactsRoutes.use(authMiddleware);
contactsRoutes.post('/', validateRequest(createContactSchema), contactController.create);
contactsRoutes.get('/', contactController.list);
contactsRoutes.get('/:id', validateRequest(paramsSchema), contactController.getById);
contactsRoutes.put('/:id', validateRequest(paramsSchema), validateRequest(updateContactSchema), contactController.update);
contactsRoutes.delete('/:id', validateRequest(paramsSchema), contactController.delete);

export default contactsRoutes;