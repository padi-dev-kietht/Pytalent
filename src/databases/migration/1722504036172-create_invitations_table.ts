import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createInvitationsTable1722504036172 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'invitations',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'status',
            type: 'varchar(255)',
          },
          {
            name: 'assessment_id',
            type: 'integer',
          },
          {
            name: 'candidate_id',
            type: 'integer',
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
      }),
    );

    await queryRunner.createForeignKeys('invitations', [
      new TableForeignKey({
        columnNames: ['assessment_id'],
        referencedTableName: 'assessments',
        referencedColumnNames: ['id'],
      }),

      new TableForeignKey({
        columnNames: ['candidate_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('invitations');
  }
}
