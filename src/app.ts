import 'express-async-errors'; // Importante vir antes do express
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middlewares/errorHandler.js';

const app: Application = express();

// Middlewares Globais
app.use(helmet()); // Segurança
app.use(cors()); // Permite requisições do front-end
app.use(express.json()); // Entende JSON no body

// Rotas de Health Check (Teste inicial)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API Glicemy funcionando perfeitamente!' });
});

// Registrar rotas dos módulos aqui futuramente...

// Middleware de erro (Sempre por último!)
app.use(errorHandler);

export default app;