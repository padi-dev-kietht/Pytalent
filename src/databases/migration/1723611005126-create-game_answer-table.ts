import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createGameAnswerTable1723611005126 implements MigrationInterface {
  name = 'createGameAnswerTable1723611005126';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'game_answer',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'game_id',
            type: 'integer',
          },
          {
            name: 'question_id',
            type: 'integer',
          },
          {
            name: 'level_id',
            type: 'integer',
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
            name: 'answer',
            type: 'text',
          },
          {
            name: 'score',
            type: 'integer',
          },
          {
            name: 'is_correct',
            type: 'boolean',
          },
          {
            name: 'total_time',
            type: 'integer',
          },
          {
            name: 'time_taken',
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

    await queryRunner.createForeignKeys('game_answer', [
      new TableForeignKey({
        columnNames: ['game_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'games',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['question_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'logical_questions',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['assessment_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'assessments',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['candidate_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('game_answer');
  }
}
