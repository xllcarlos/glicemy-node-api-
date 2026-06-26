import { Router } from 'express';
import { WeightController } from './weight.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createWeightSchema, paramsSchema, updateWeightSchema } from './weight.schema.js';

const weightRoutes = Router();
const weightController = new WeightController();

weightRoutes.use(authMiddleware);
weightRoutes.post('/', validateRequest(createWeightSchema), weightController.create);
weightRoutes.get('/', weightController.list);
weightRoutes.get('/:id', validateRequest(paramsSchema), weightController.getById);
weightRoutes.put('/:id', validateRequest(paramsSchema), validateRequest(updateWeightSchema), weightController.update);
weightRoutes.delete('/:id', validateRequest(paramsSchema), weightController.delete);

export default weightRoutes;