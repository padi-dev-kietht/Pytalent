import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { CustomizeException } from '@exception/customize.exception';
import { I18nValidationException } from 'nestjs-i18n';
import { env } from '@env';
import { logger } from '@logs/app.log';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    //response customize exception
    if (exception instanceof CustomizeException) {
      const responseException: any = exception.getResponse();
      response.status(HttpStatus.OK).json({
        status: false,
        data: {},
        message: responseException.message,
      });
    } else {
      let message = exception.message;

      // response validate exception
      if (exception instanceof I18nValidationException) {
        message = exception.errors.map((err) => {
          return Object.values(err.constraints).join(', ');
        });
      }

      if (env.node != 'development') {
        message = 'something errors';
      }
      logger.error(`errors with message: ${message}`);
      //response system exception
      response
        .status(exception.status ?? HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          statusCode: exception.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
          timestamp: new Date().toISOString(),
          message: message,
        });
    }
  }
}
