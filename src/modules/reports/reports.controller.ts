import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ReportService } from './reports.service.js';
import { AuthRequest } from '../../middlewares/auth.middleware.js';

const reportService = new ReportService();

export class ReportController {
  async downloadReport(req: AuthRequest, res: Response) {
    try {
      const pdfBuffer = await reportService.generatePatientReport(req.user!.id);
      
      // Configurar os headers para forçar o download em formato PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=relatorio-glicemy.pdf');
      
      res.status(StatusCodes.OK).send(pdfBuffer);
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  async sendEmail(req: AuthRequest, res: Response) {
    try {
      const result = await reportService.sendReportByEmail(req.user!.id);
      res.status(StatusCodes.OK).json(result);
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }
}