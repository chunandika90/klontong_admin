import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'object' && 'message' in res
        ? (res as any).message
        : exception.message;
    } else if (exception instanceof Error) {
      // Handle DB unique constraint violation (PostgreSQL error code 23505)
      if ((exception as any).code === '23505') {
        status = HttpStatus.CONFLICT;
        message = 'A record with this value already exists';
      } else {
        this.logger.error(`Unhandled: ${exception.message}`, exception.stack);
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
