import { Router } from 'express';
import { ReminderController } from './reminders.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createReminderSchema, paramsSchema, updateReminderSchema } from './reminders.schema.js';

const remindersRoutes = Router();
const remindersController = new ReminderController();

remindersRoutes.use(authMiddleware);
remindersRoutes.post('/', validateRequest(createReminderSchema), remindersController.create);
remindersRoutes.get('/', remindersController.list);
remindersRoutes.get('/:id', validateRequest(paramsSchema), remindersController.getById);
remindersRoutes.put('/:id', validateRequest(paramsSchema), validateRequest(updateReminderSchema), remindersController.update);
remindersRoutes.delete('/:id', validateRequest(paramsSchema), remindersController.delete);

export default remindersRoutes;