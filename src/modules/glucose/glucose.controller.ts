import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { GlucoseService } from './glucose.service.js';
import { AuthRequest } from '../../middlewares/auth.middleware.js';

const glucoseService = new GlucoseService();

export class GlucoseController {
  
  async create(req: AuthRequest, res: Response) {
    try {
      const record = await glucoseService.create(req.user!.id, req.body);
      res.status(StatusCodes.CREATED).json({ message: 'Registro de glicemia salvo!', record });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async list(req: AuthRequest, res: Response) {
    try {
      const records = await glucoseService.findByUser(req.user!.id);
      res.status(StatusCodes.OK).json(records);
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  async getById(req: AuthRequest, res: Response) {
    try {
      const record = await glucoseService.findById(req.params.id as string, req.user!.id);
      res.status(StatusCodes.OK).json(record);
    } catch (error: any) {
      res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const record = await glucoseService.update(req.params.id as string, req.user!.id, req.body);
      res.status(StatusCodes.OK).json({ message: 'Registro atualizado!', record });
    } catch (error: any) {
      res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      await glucoseService.delete(req.params.id as string, req.user!.id);
      res.status(StatusCodes.NO_CONTENT).send(); 
    } catch (error: any) {
      res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    }
  }
}