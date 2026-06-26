import 'express-async-errors';
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import { errorHandler } from './middlewares/errorHandler.js';
import { swaggerSpec } from './config/swagger.config.js';
import authRoutes from './modules/auth/auth.routes.js';
import glucoseRoutes from './modules/glucose/glucose.routes.js';
import bpRoutes from './modules/blood-pressure/blood-pressure.routes.js';
import weightRoutes from './modules/weight/weight.routes.js';
import heightRoutes from './modules/height/height.routes.js';
import hba1cRoutes from './modules/hba1c/hba1c.routes.js';
import medicationsRoutes from './modules/medications/medications.routes.js';
import remindersRoutes from './modules/reminders/reminders.routes.js';

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Rota do Swagger (Documentação visual)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API Glicemy funcionando perfeitamente!' });
});

// 📌 Registrando Módulos
app.use('/api/auth', authRoutes);
app.use('/api/glucose', glucoseRoutes);
app.use('/api/blood-pressure', bpRoutes);
app.use('/api/weight', weightRoutes);
app.use('/api/height', heightRoutes);
app.use('/api/hba1c', hba1cRoutes);
app.use('/api/medications', medicationsRoutes);
app.use('/api/reminders', remindersRoutes);

// Tratamento de Erros
app.use(errorHandler);

export default app;