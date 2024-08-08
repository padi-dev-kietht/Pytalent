import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Exists } from '../shared/decorator/exists.decorator';
import { Assessments } from '../entities/assessments.entity';

export class CreateAssessmentsDto {
  @IsNotEmpty()
  @IsString()
  @Exists(Assessments, 'name')
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  start_date: Date;

  @IsOptional()
  end_date: Date;

  @IsOptional()
  is_archived: boolean;

  @IsOptional()
  created_by: number;
}
