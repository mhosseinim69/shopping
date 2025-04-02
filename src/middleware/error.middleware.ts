import { Request, Response, NextFunction } from 'express';
import { AppLoggerService } from '../logger/logger.service';

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const logger = new AppLoggerService();

  logger.error(`Error in ${req.method} ${req.url} - ${err.message}`, err.stack);

  res.status(500).json({ message: 'Internal server error' });
}
