import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let bizCode = '';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as Record<string, unknown>;
        bizCode = (responseObj.bizCode as string | undefined) || null;
        if (Array.isArray(responseObj.message)) {
          message = responseObj.message[0] as string;
        } else if (responseObj.message) {
          message = responseObj.message as string;
        }
      }
    } else if (exception instanceof QueryFailedError) {
      const err = exception as QueryFailedError & { code?: string };
      if (err.code === 'ER_DUP_ENTRY') {
        status = HttpStatus.CONFLICT;
        message = '数据已存在，请勿重复提交';
      } else {
        message = err.message || '数据库操作失败';
      }
    } else if (exception instanceof Error) {
      if (this.configService.get('app.env') === 'development') {
        console.error(exception); // 日志记录真实错误
      }
      message = exception.message || 'Internal server error';
    }

    response.status(status).json({
      code: status,
      message,
      data: null,
      bizCode,
    });
  }
}
