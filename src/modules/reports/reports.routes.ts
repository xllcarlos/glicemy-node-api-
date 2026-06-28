import { Router } from 'express';
import { ReportController } from './reports.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const reportsRoutes = Router();
const reportController = new ReportController();

reportsRoutes.use(authMiddleware);
reportsRoutes.get('/download', reportController.downloadReport);
reportsRoutes.post('/send-email', reportController.sendEmail);

export default reportsRoutes;