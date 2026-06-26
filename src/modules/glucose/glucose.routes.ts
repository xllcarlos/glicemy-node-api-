import { Router } from 'express';
import { GlucoseController } from './glucose.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createGlucoseSchema, paramsSchema, updateGlucoseSchema } from './glucose.schema.js';

const glucoseRoutes = Router();
const glucoseController = new GlucoseController();

// Todas as rotas abaixo requerem o Token JWT
glucoseRoutes.use(authMiddleware);

// Criar
glucoseRoutes.post('/', validateRequest(createGlucoseSchema), glucoseController.create);

// Listar todos
glucoseRoutes.get('/', glucoseController.list);

// Buscar um específico
glucoseRoutes.get('/:id', validateRequest(paramsSchema), glucoseController.getById);

// Atualizar
glucoseRoutes.put('/:id', 
  validateRequest(paramsSchema), 
  validateRequest(updateGlucoseSchema), 
  glucoseController.update
);

// Deletar
glucoseRoutes.delete('/:id', validateRequest(paramsSchema), glucoseController.delete);

export default glucoseRoutes;