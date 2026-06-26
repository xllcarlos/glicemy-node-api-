import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(`[Erro]: ${err.message}`);

  // Se for um erro conhecido, você pode mapear aqui.
  // Por enquanto, vamos retornar Internal Server Error genérico
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: err.message || 'Erro interno do servidor',
  });
}