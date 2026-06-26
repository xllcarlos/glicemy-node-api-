import { Router } from 'express';
import { HeightController } from './height.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createHeightSchema, paramsSchema, updateHeightSchema } from './height.schema.js';

const heightRoutes = Router();
const heightController = new HeightController();

heightRoutes.use(authMiddleware);
heightRoutes.post('/', validateRequest(createHeightSchema), heightController.create);
heightRoutes.get('/', heightController.list);
heightRoutes.get('/:id', validateRequest(paramsSchema), heightController.getById);
heightRoutes.put('/:id', validateRequest(paramsSchema), validateRequest(updateHeightSchema), heightController.update);
heightRoutes.delete('/:id', validateRequest(paramsSchema), heightController.delete);

export default heightRoutes;