import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateAssessmentsDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsDateString()
  start_date: Date;

  @IsDateString()
  end_date: Date;

  @IsBoolean()
  is_archived: boolean;

  @IsInt()
  created_by: number;
}
