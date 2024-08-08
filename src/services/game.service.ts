import { Injectable } from '@nestjs/common';

@Injectable()
export class GamesService {
  getHello(): string {
    return 'Hello World!';
  }
}
