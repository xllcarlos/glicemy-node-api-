import { Router } from 'express';
import { HbA1cController } from './hba1c.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createHbA1cSchema, paramsSchema, updateHbA1cSchema } from './hba1c.schema.js';

const hba1cRoutes = Router();
const hba1cController = new HbA1cController();

hba1cRoutes.use(authMiddleware);
hba1cRoutes.post('/', validateRequest(createHbA1cSchema), hba1cController.create);
hba1cRoutes.get('/', hba1cController.list);
hba1cRoutes.get('/:id', validateRequest(paramsSchema), hba1cController.getById);
hba1cRoutes.put('/:id', validateRequest(paramsSchema), validateRequest(updateHbA1cSchema), hba1cController.update);
hba1cRoutes.delete('/:id', validateRequest(paramsSchema), hba1cController.delete);

export default hba1cRoutes;