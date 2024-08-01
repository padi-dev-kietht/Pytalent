import { validate, ValidationError } from 'class-validator';
import { Exists } from '@shared/decorator/exists.decorator';

describe('Exists Decorator', () => {
  class NoModel {
    @Exists('nomodel', 'email')
    isExists: string;
  }

  class ModelClass {
    @Exists('users', 'email')
    isExists: string;
  }

  test('Error: Return undefined', async () => {
    const model: any = new NoModel();
    model.isExists = 'email@gmail.com';
    return validate(model).then((errors: ValidationError[]) => {
      expect(errors.length).toBe(1);
      const expectedErrorObject = [
        {
          property: 'isExists',
          constraints: {
            customValidation: 'model nomodel not found',
          },
        },
      ];
      expect(errors).toMatchObject(expectedErrorObject);
    });
  });

  test('Error: Return not found item', async () => {
    const model: any = new ModelClass();
    model.isExists = 'user1@gmail.com';
    return validate(model).then((errors: ValidationError[]) => {
      expect(errors.length).toBe(1);
      const expectedErrorObject = [
        {
          property: 'isExists',
          constraints: {
            customValidation: model.isExists + ' is already exist',
          },
        },
      ];
      expect(errors).toMatchObject(expectedErrorObject);
    });
  });

  test('Success: Return success', async () => {
    const model: any = new ModelClass();
    model.isExists = 'testdecorator@gmail.com';
    return validate(model).then((errors: ValidationError[]) => {
      expect(errors.length).toBe(0);
    });
  });
});
