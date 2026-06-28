import { Router } from 'express';
import { UserController } from './users.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { updateUserSchema } from './users.schema.js';

const usersRoutes = Router();
const userController = new UserController();

usersRoutes.use(authMiddleware);
usersRoutes.get('/me', userController.getProfile);
usersRoutes.put('/me', validateRequest(updateUserSchema), userController.updateProfile);
usersRoutes.delete('/me', userController.deleteAccount);

export default usersRoutes;