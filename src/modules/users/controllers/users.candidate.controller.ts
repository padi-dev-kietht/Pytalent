import { Controller } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { BaseController } from '@modules/app/base.controller';

@Controller('candidates/users')
export class UsersCandidateController extends BaseController {
  constructor(private readonly usersService: UsersService) {
    super();
  }
}
