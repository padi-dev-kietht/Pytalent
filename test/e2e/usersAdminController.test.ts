import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@modules/app/app.module';
import { AppService } from '@modules/app/app.service';
import { AuthService } from '@modules/auth/auth.service';
import { RoleEnum } from '@enum/role.enum';

describe('UsersAdminController (e2e)', () => {
  let app: INestApplication;
  let authService;
  let token;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [AppService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    authService = await moduleFixture.get(AuthService);
    token = await getToken();
  });

  afterAll(async () => {
    await app.close();
  });

  async function getToken() {
    const result = await authService.login({
      email: 'user1@gmail.com',
      password: '123456',
    });
    return 'Bearer ' + result;
  }

  test('Api create user: /admin/users/create', async () => {
    const res = await request(app.getHttpServer())
      .post('/admin/users/create')
      .send({
        email: 'test@gmail.com',
        password: '123456',
        role: RoleEnum.ADMIN,
      })
      .set('Authorization', token);

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual(true);
  });
});
