import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateRequest = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      // Usando duck typing para evitar erros estritos do TS com a classe ZodError
      if (error?.name === 'ZodError') {
        return res.status(400).json({ message: 'Erro de validação', errors: error.errors || error.issues });
      }
      return res.status(400).json({ message: error?.message || 'Erro interno' });
    }
  };
};