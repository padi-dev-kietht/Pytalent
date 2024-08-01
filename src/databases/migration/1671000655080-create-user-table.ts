import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createUserTable1671000655080 implements MigrationInterface {
  name = 'createUserTable1671000655080';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'email',
            type: 'varchar(255)',
          },
          {
            name: 'password',
            type: 'varchar(255)',
          },
          {
            name: 'role',
            type: 'varchar(255)',
          },
          {
            name: 'created_at',
            type: 'datetime',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            isNullable: true,
          },
        ],
        uniques: [
          {
            name: 'email_unique',
            columnNames: ['email'],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
