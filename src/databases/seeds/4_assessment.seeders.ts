import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { AssessmentsEntity } from '../../entities';
import { AssessmentStatusEnum } from '../../common/enum/assessment-status.enum';

export default class CreateAssessment implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    const assessmentData = [
      {
        id: 1,
        name: 'Assessment 1',
        description: 'Assessment 1',
        start_date: new Date(),
        end_date: new Date(),
        created_by: 2,
        is_archived: false,
        created_at: new Date(),
        updated_at: new Date(),
        status: AssessmentStatusEnum.IDLE,
      },
    ];
    const assessmentCandidateData = [
      {
        assessment_id: 1,
        candidate_id: 3,
      },
    ];
    const assessmentGameData = [
      {
        assessment_id: 1,
        game_id: 1,
      },
      {
        assessment_id: 1,
        game_id: 2,
      },
    ];

    await connection
      .createQueryBuilder()
      .insert()
      .into(AssessmentsEntity)
      .values(assessmentData)
      .execute();

    await connection
      .createQueryBuilder()
      .insert()
      .into('assessments_games')
      .values(assessmentGameData)
      .execute();

    await connection
      .createQueryBuilder()
      .insert()
      .into('assessments_candidates')
      .values(assessmentCandidateData)
      .execute();
  }
}
