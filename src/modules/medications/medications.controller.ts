import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MedicationService } from './medications.service.js';
import { AuthRequest } from '../../middlewares/auth.middleware.js';

const medicationsService = new MedicationService();

export class MedicationController {
  async create(req: AuthRequest, res: Response) {
    try {
      const record = await medicationsService.create(req.user!.id, req.body);
      res.status(StatusCodes.CREATED).json(record);
    } catch (error: any) { res.status(StatusCodes.BAD_REQUEST).json({ message: error.message }); }
  }
  async list(req: AuthRequest, res: Response) {
    try {
      const records = await medicationsService.findByUser(req.user!.id);
      res.status(StatusCodes.OK).json(records);
    } catch (error: any) { res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message }); }
  }
  async getById(req: AuthRequest, res: Response) {
    try {
      const record = await medicationsService.findById(req.params.id as string, req.user!.id);
      res.status(StatusCodes.OK).json(record);
    } catch (error: any) { res.status(StatusCodes.NOT_FOUND).json({ message: error.message }); }
  }
  async update(req: AuthRequest, res: Response) {
    try {
      const record = await medicationsService.update(req.params.id as string, req.user!.id, req.body);
      res.status(StatusCodes.OK).json(record);
    } catch (error: any) { res.status(StatusCodes.NOT_FOUND).json({ message: error.message }); }
  }
  async delete(req: AuthRequest, res: Response) {
    try {
      await medicationsService.delete(req.params.id as string, req.user!.id);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error: any) { res.status(StatusCodes.NOT_FOUND).json({ message: error.message }); }
  }
}