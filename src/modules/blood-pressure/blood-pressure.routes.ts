import { Router } from 'express';
import { BloodPressureController } from './blood-pressure.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createBloodPressureSchema, paramsSchema, updateBloodPressureSchema } from './blood-pressure.schema.js';

const bpRoutes = Router();
const bpController = new BloodPressureController();

bpRoutes.use(authMiddleware);

bpRoutes.post('/', validateRequest(createBloodPressureSchema), bpController.create);
bpRoutes.get('/', bpController.list);
bpRoutes.get('/:id', validateRequest(paramsSchema), bpController.getById);
bpRoutes.put('/:id', validateRequest(paramsSchema), validateRequest(updateBloodPressureSchema), bpController.update);
bpRoutes.delete('/:id', validateRequest(paramsSchema), bpController.delete);

export default bpRoutes;