import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { HealthTipsService } from './health-tips.service.js';

const healthTipsService = new HealthTipsService();

export class HealthTipsController {
  async create(req: Request, res: Response) {
    try {
      const record = await healthTipsService.create(req.body);
      res.status(StatusCodes.CREATED).json(record);
    } catch (error: any) { 
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message }); 
    }
  }

  async list(req: Request, res: Response) {
    try {
      const records = await healthTipsService.findAll();
      res.status(StatusCodes.OK).json(records);
    } catch (error: any) { 
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message }); 
    }
  }

  async getRandom(req: Request, res: Response) {
    try {
      const records = await healthTipsService.findRandomAppTips();
      res.status(StatusCodes.OK).json(records);
    } catch (error: any) { 
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message }); 
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const record = await healthTipsService.findById(req.params.id as string);
      res.status(StatusCodes.OK).json(record);
    } catch (error: any) { 
      res.status(StatusCodes.NOT_FOUND).json({ message: error.message }); 
    }
  }

  async update(req: Request, res: Response) {
    try {
      const record = await healthTipsService.update(req.params.id as string, req.body);
      res.status(StatusCodes.OK).json(record);
    } catch (error: any) { 
      res.status(StatusCodes.NOT_FOUND).json({ message: error.message }); 
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await healthTipsService.delete(req.params.id as string);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error: any) { 
      res.status(StatusCodes.NOT_FOUND).json({ message: error.message }); 
    }
  }
}