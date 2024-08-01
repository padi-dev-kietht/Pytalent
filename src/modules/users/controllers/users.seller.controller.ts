import { Controller } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { BaseController } from '@modules/app/base.controller';

@Controller('sellers/users')
export class UsersSellerController extends BaseController {
  constructor(private readonly usersService: UsersService) {
    super();
  }
}
