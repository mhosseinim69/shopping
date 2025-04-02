import { Request, Response, NextFunction } from 'express';

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(`Error: ${err.message}`);
  res.status(500).json({ message: 'Internal server error' });
}
