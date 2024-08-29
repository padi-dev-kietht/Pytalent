import { Controller } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { BaseController } from './base.controller';

@Controller('candidates')
export class UsersCandidateController extends BaseController {
  constructor(private readonly usersService: UsersService) {
    super();
  }
}
