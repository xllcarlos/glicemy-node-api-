import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { HbA1cService } from './hba1c.service.js';
import { AuthRequest } from '../../middlewares/auth.middleware.js';

const hba1cService = new HbA1cService();

export class HbA1cController {
  async create(req: AuthRequest, res: Response) {
    try {
      const record = await hba1cService.create(req.user!.id, req.body);
      res.status(StatusCodes.CREATED).json(record);
    } catch (error: any) { res.status(StatusCodes.BAD_REQUEST).json({ message: error.message }); }
  }
  async list(req: AuthRequest, res: Response) {
    try {
      const records = await hba1cService.findByUser(req.user!.id);
      res.status(StatusCodes.OK).json(records);
    } catch (error: any) { res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message }); }
  }
  async getById(req: AuthRequest, res: Response) {
    try {
      const record = await hba1cService.findById(req.params.id, req.user!.id);
      res.status(StatusCodes.OK).json(record);
    } catch (error: any) { res.status(StatusCodes.NOT_FOUND).json({ message: error.message }); }
  }
  async update(req: AuthRequest, res: Response) {
    try {
      const record = await hba1cService.update(req.params.id, req.user!.id, req.body);
      res.status(StatusCodes.OK).json(record);
    } catch (error: any) { res.status(StatusCodes.NOT_FOUND).json({ message: error.message }); }
  }
  async delete(req: AuthRequest, res: Response) {
    try {
      await hba1cService.delete(req.params.id, req.user!.id);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error: any) { res.status(StatusCodes.NOT_FOUND).json({ message: error.message }); }
  }
}