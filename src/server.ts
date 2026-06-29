import 'dotenv/config';
import app from './app.js';

const requiredEnv = ['DATABASE_URL', 'JWT_SECRET'];
const missingEnv = requiredEnv.filter((name) => !process.env[name]);

const PORT = Number(process.env.PORT) || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const APP_NAME = process.env.APP_NAME || 'Glicemy API';
const BASE_URL = `http://localhost:${PORT}`;

if (missingEnv.length > 0) {
  console.warn(`⚠️ Variáveis de ambiente ausentes: ${missingEnv.join(', ')}`);
}

app.listen(PORT, () => {
  console.log(`${APP_NAME} inicializado com sucesso`);
  console.log(`Ambiente: ${NODE_ENV}`);
  console.log(`Porta: ${PORT}`);
  console.log(`Documentação: ${BASE_URL}/api-docs`);
  console.log(`Health: ${BASE_URL}/health`);
  console.log('Endpoints principais ativos:');
  console.log('   /api/auth');
  console.log('   /api/glucose');
  console.log('   /api/blood-pressure');
  console.log('   /api/weight');
  console.log('   /api/height');
  console.log('   /api/hba1c');
  console.log('   /api/medications');
  console.log('   /api/reminders');
  console.log('   /api/ai-chat');
  console.log('   /api/reports');
  console.log('   /api/users');
  console.log('   /api/emergency-contacts');
  console.log('   /api/health-tips');

  if (missingEnv.length > 0) {
    console.warn('⚠️ A API foi iniciada, mas algumas variáveis essenciais estão faltando.');
  }
});