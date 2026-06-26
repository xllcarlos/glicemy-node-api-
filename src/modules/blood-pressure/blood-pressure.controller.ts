import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BloodPressureService } from './blood-pressure.service.js';
import { AuthRequest } from '../../middlewares/auth.middleware.js';

const bpService = new BloodPressureService();

export class BloodPressureController {
  async create(req: AuthRequest, res: Response) {
    try {
      const record = await bpService.create(req.user!.id, req.body);
      res.status(StatusCodes.CREATED).json({ message: 'Registro de pressão salvo!', record });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async list(req: AuthRequest, res: Response) {
    try {
      const records = await bpService.findByUser(req.user!.id);
      res.status(StatusCodes.OK).json(records);
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  async getById(req: AuthRequest, res: Response) {
    try {
      const record = await bpService.findById(req.params.id, req.user!.id);
      res.status(StatusCodes.OK).json(record);
    } catch (error: any) {
      res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const record = await bpService.update(req.params.id, req.user!.id, req.body);
      res.status(StatusCodes.OK).json({ message: 'Registro atualizado!', record });
    } catch (error: any) {
      res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      await bpService.delete(req.params.id, req.user!.id);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error: any) {
      res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    }
  }
}