import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthService } from './auth.service.js';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const user = await authService.register(req.body);
      res.status(StatusCodes.CREATED).json({ message: 'Usuário criado com sucesso', user });
    } catch (error: any) {
      res.status(StatusCodes.CONFLICT).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const result = await authService.login(req.body);
      res.status(StatusCodes.OK).json(result);
    } catch (error: any) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: error.message });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const result = await authService.forgotPassword(req.body.email);
      res.status(StatusCodes.OK).json(result);
    } catch (error: any) {
      // Retornamos 200 OK mesmo com erro para evitar vazamento de dados (Enumeration Attack)
      res.status(StatusCodes.OK).json({ message: 'Se o e-mail existir, um link de recuperação será enviado.' });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const result = await authService.resetPassword(req.body);
      res.status(StatusCodes.OK).json(result);
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }
}