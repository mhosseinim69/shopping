import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AppLoggerService } from '../logger/logger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new AppLoggerService();

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    this.logger.warn(
      `HTTP ${status} Error in ${request.method} ${request.url}: ${JSON.stringify(errorResponse)}`,
    );

    response.status(status).json({
      statusCode: status,
      message: errorResponse['message'] || 'Unexpected error',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
