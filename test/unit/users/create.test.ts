import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@modules/app/app.module';
import { AppService } from '@modules/app/app.service';
import { RoleEnum } from '@enum/role.enum';
import { plainToClass } from 'class-transformer';
import { Users } from '@entities/users.entity';
import * as bcrypt from 'bcrypt';

describe('UsersAdminController (e2e)', () => {
  let app: INestApplication;
  let usersRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [AppService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    usersRepository = await moduleFixture.get('UsersRepository');
  });

  afterAll(async () => {
    await app.close();
  });

  test('Create Function', async () => {
    const createUserObject = plainToClass(Users, {
      email: 'testservice@gmail.com',
      password: await bcrypt.hash('123456', 10),
      role: RoleEnum.SELLER,
    });

    const createUser: Users = await usersRepository.save(createUserObject);

    expect(createUser).not.toBeNull();
    expect(createUser.email).toEqual(createUserObject.email);
  });
});
