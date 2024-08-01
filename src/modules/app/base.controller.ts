import { HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import {
  ApiResponseInterface,
  ResponseInterface,
} from '@interfaces/response.interface';

export class BaseController {
  public successResponse(result: ResponseInterface, @Res() res: Response) {
    const { data, message } = result;
    return this.apiResponse(res, {
      status: true,
      data: data ?? {},
      message: message ?? 'success',
    });
  }

  public errorsResponse(result: ResponseInterface, @Res() res: Response) {
    const { data, message } = result;
    return this.apiResponse(res, {
      status: false,
      data: data ?? {},
      message: message ?? 'errors',
    });
  }

  public apiResponse(@Res() res: Response, result: ApiResponseInterface) {
    const { status, data, message } = result;
    return res.status(HttpStatus.OK).json({
      status: status,
      data: data ?? {},
      message: message,
    });
  }
}
