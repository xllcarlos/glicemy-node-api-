import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { validateRequest } from '../../middlewares/validateRequest';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from './auth.schema.js';

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post('/register', validateRequest(registerSchema), authController.register);
authRoutes.post('/login', validateRequest(loginSchema), authController.login);
authRoutes.post('/forgot-password', validateRequest(forgotPasswordSchema), authController.forgotPassword);
authRoutes.post('/reset-password', validateRequest(resetPasswordSchema), authController.resetPassword);

export default authRoutes;