import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserService } from './users.service.js';
import { AuthRequest } from '../../middlewares/auth.middleware.js';

const userService = new UserService();

export class UserController {
  async getProfile(req: AuthRequest, res: Response) {
    try {
      const profile = await userService.getProfile(req.user!.id);
      res.status(StatusCodes.OK).json(profile);
    } catch (error: any) { res.status(StatusCodes.NOT_FOUND).json({ message: error.message }); }
  }

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const updated = await userService.updateProfile(req.user!.id, req.body);
      res.status(StatusCodes.OK).json(updated);
    } catch (error: any) { res.status(StatusCodes.BAD_REQUEST).json({ message: error.message }); }
  }

  async deleteAccount(req: AuthRequest, res: Response) {
    try {
      await userService.deleteAccount(req.user!.id);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error: any) { res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message }); }
  }
}