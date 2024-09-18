import { IsEmail, IsNotEmpty, IsInt } from 'class-validator';

export class InviteCandidateDto {
  @IsEmail()
  email: string;

  @IsInt()
  @IsNotEmpty()
  assessmentId: number;
}
