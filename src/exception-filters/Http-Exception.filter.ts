import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const httpMessage =
      (exception as HttpException).message || 'Internal Server Error';

    const responseBody = {
      method: httpAdapter.getRequestMethod(ctx.getRequest()),
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message: httpMessage,
    };

    Logger.error(
      `${httpAdapter.getRequestMethod(
        ctx.getRequest(),
      )} ${httpAdapter.getRequestUrl(ctx.getRequest())}`,
      JSON.stringify(responseBody),
      'ExceptionFilter',
    );

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
