import { Injectable, NestMiddleware } from '@nestjs/common';
import * as hpp from 'hpp';

@Injectable()
export class HppMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    hpp()(req, res, next);
  }
}
