import { Router } from 'express';
import { MedicationController } from './medications.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createMedicationSchema, paramsSchema, updateMedicationSchema } from './medications.schema.js';

const medicationsRoutes = Router();
const medicationsController = new MedicationController();

medicationsRoutes.use(authMiddleware);
medicationsRoutes.post('/', validateRequest(createMedicationSchema), medicationsController.create);
medicationsRoutes.get('/', medicationsController.list);
medicationsRoutes.get('/:id', validateRequest(paramsSchema), medicationsController.getById);
medicationsRoutes.put('/:id', validateRequest(paramsSchema), validateRequest(updateMedicationSchema), medicationsController.update);
medicationsRoutes.delete('/:id', validateRequest(paramsSchema), medicationsController.delete);

export default medicationsRoutes;