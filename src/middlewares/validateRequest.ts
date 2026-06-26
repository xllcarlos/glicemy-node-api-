import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next(); // Tudo certo, passa para o Controller
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: 'error',
          message: 'Erro de validação nos dados enviados',
          errors: error.errors.map(err => ({
            campo: err.path.join('.'),
            mensagem: err.message
          })),
        });
        return;
      }
      next(error);
    }
  };
};