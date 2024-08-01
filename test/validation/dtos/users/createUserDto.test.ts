import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { RoleEnum } from '@enum/role.enum';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@modules/app/app.module';
import { AppService } from '@modules/app/app.service';
import { INestApplication } from '@nestjs/common';

describe('Create User DTO', () => {
  let app: INestApplication;
  let param;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [AppService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.close();
    await app.init();

    param = {
      email: 'testdto@gmail.com',
      password: '123456',
      role: RoleEnum.MEMBER,
    };
  });
  afterAll(async () => {
    await app.close();
  });

  test('Email is not empty', async () => {
    const { email: _, ...data } = param;
    const validationError = [
      {
        property: 'email',
        constraints: {
          isNotEmpty: 'email should not be empty',
        },
      },
    ];

    const ofParamDTO = plainToInstance(CreateUserDto, data);
    const errors = await validate(ofParamDTO);

    expect(errors.length).toBe(1);
    expect(errors).toMatchObject(validationError);
  });

  test('Email must be an email', async () => {
    param.email = 'test';
    const validationError = [
      {
        property: 'email',
        constraints: {
          isEmail: 'email must be an email',
        },
      },
    ];

    const ofParamDTO = plainToInstance(CreateUserDto, param);
    const errors = await validate(ofParamDTO);

    expect(errors.length).toBe(1);
    expect(errors).toMatchObject(validationError);
  });

  test('Password is not empty', async () => {
    const { password: _, ...data } = param;
    const validationError = [
      {
        property: 'password',
        constraints: {
          isNotEmpty: 'password should not be empty',
        },
      },
    ];

    const ofParamDTO = plainToInstance(CreateUserDto, data);
    const errors = await validate(ofParamDTO);

    expect(errors.length).toBe(1);
    expect(errors).toMatchObject(validationError);
  });

  test('Role is not empty', async () => {
    const { role: _, ...data } = param;
    const validationError = [
      {
        property: 'role',
        constraints: {
          isNotEmpty: 'role should not be empty',
        },
      },
    ];

    const ofParamDTO = plainToInstance(CreateUserDto, data);
    const errors = await validate(ofParamDTO);

    expect(errors.length).toBe(1);
    expect(errors).toMatchObject(validationError);
  });

  test('Role must be one of the following values: admin, seller, member', async () => {
    param.role = 'string';
    const validationError = [
      {
        property: 'role',
        constraints: {
          isEnum:
            'role must be one of the following values: admin, seller, member',
        },
      },
    ];

    const ofParamDTO = plainToInstance(CreateUserDto, param);
    const errors = await validate(ofParamDTO);

    expect(errors.length).toBe(1);
    expect(errors).toMatchObject(validationError);
  });

  test('Validation Create User DTO Success', async () => {
    const ofParamDTO = plainToInstance(CreateUserDto, param);
    const errors = await validate(ofParamDTO);

    expect(errors.length).toBe(0);
  });
});
