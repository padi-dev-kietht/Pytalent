import { Controller } from '@nestjs/common';

import { BaseController } from './base.controller';
import { GamesService } from '../services/game.service';

@Controller('games')
export class GamesController extends BaseController {
  constructor(private gameservice: GamesService) {
    super();
  }
}
