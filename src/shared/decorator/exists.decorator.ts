import { AppDataSource } from '@databases/data-source';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function Exists(
  entity: any,
  key: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    let mess;
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entity, key],
      validator: {
        async validate(value: any, args: ValidationArguments) {
          const [entity, tableField] = args.constraints;

          if (!value) {
            return true;
          }

          let connection;
          let repository;
          if (AppDataSource.isInitialized) {
            repository = AppDataSource.manager.getRepository(entity);
          } else {
            connection = await AppDataSource.initialize();
            if (!connection.hasMetadata(entity)) {
              await connection.destroy();
              mess = 'model ' + entity + ' not found';
              return false;
            }

            repository = connection.getRepository(entity);
          }

          const whereClause = {};

          whereClause[tableField] = value;

          const result = await repository.findOne({
            where: whereClause,
          });
          if (!result) {
            return true;
          }
          mess = value + ' is already exist';
          return false;
        },
        defaultMessage(): string {
          return mess != '' ? mess : propertyName + ' is already exist';
        },
      },
    });
  };
}
