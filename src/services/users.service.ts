import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Users } from '@entities/users.entity';
import { plainToClass } from 'class-transformer';
import {
  createCandidateInterface,
  createUserInterface,
  FindCandidateInterface,
  FindUserInterface,
} from '@interfaces/user.interface';
import { RoleEnum } from '@enum/role.enum';
import { UsersRepository } from '../repositories/user.repository';
import { Games } from '../entities/games.entity';
import { GamesRepository } from '../repositories/game.repository';
import { Assessments } from '../entities/assessments.entity';
import { AssessmentsRepository } from '../repositories/assessment.repository';
import { InviteCandidateDto } from '../dtos/invite-candidate.dto';
import { InvitationStatusEnum } from '../common/enum/invitation-status.enum';
import { InvitationsRepository } from '../repositories/invitation.repository';
import { MailService } from '../common/lib/mail/mail.lib';
import { AssessmentStatusEnum } from '../common/enum/assessment-status.enum';
import { Invitations } from '../entities/invitations.entity';

@Injectable()
export class UsersService {
  constructor(
    private gamesRepository: GamesRepository,
    private usersRepository: UsersRepository,
    private assessmentsRepository: AssessmentsRepository,
    private invitationsRepository: InvitationsRepository,
    private mailService: MailService,
  ) {}

  // ADMIN
  async checkOrCreateHr(params: FindUserInterface): Promise<Users> {
    let user: Users = await this.usersRepository.findOne({
      where: {
        email: params.email,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const paramCreate: createUserInterface = plainToClass(Users, {
      email: params.email,
      password: await bcrypt.hash(params.password, 10),
      role: RoleEnum.HR,
    });
    user = this.usersRepository.create(paramCreate);
    await this.usersRepository.save(user);
    return user;
  }

  async deleteHr(id: number) {
    const user: Users = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.remove(user);
  }

  async addGamesToHr(id: number, gameIds: number[]) {
    const hr: Users = await this.usersRepository.findOne({
      where: { id, role: RoleEnum.HR },
    });
    if (!hr) {
      throw new NotFoundException('Hr not found');
    }

    const games: Games[] = await this.gamesRepository.findByIds(gameIds);
    if (!games.length) {
      throw new NotFoundException('Games not found');
    }

    const allGamesIds = games.map((game) => game.id);
    const allGamesExist = gameIds.every((gameId) =>
      allGamesIds.includes(gameId),
    );

    if (!allGamesExist) {
      throw new NotFoundException('Some games do not exist');
    }

    hr.games = games;
    await this.usersRepository.save(hr);
  }

  // HR
  async addGamesToAssessment(
    assessment_id: number,
    gameIds: number[],
    user_id: number,
  ) {
    const assessment: Assessments = await this.assessmentsRepository.findOne({
      where: { id: assessment_id },
    });
    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    if (assessment.is_archived) {
      throw new NotFoundException('Assessment is archived');
    }

    const games: Games[] = await this.gamesRepository.findByIds(gameIds);
    if (!games.length) {
      throw new NotFoundException('Games not found');
    }

    if (assessment.created_by !== user_id) {
      throw new NotFoundException('You are not the owner of this assessment');
    }

    const placeholders = gameIds.map(() => '?').join(', ');
    const allowedGames = await this.usersRepository.query(
      `SELECT user_id, game_id 
        FROM hr_games 
        WHERE user_id = ? AND game_id IN (${placeholders})`,
      [user_id, ...gameIds],
    );
    const allowedGameIds = allowedGames.map((game) => game.game_id);

    // Check if all provided game IDs are included in the allowed games
    const allGamesAllowed = gameIds.every((gameId) =>
      allowedGameIds.includes(gameId),
    );
    if (!allGamesAllowed) {
      throw new NotFoundException(
        'You are not allowed to add some of these games',
      );
    }

    assessment.games = games;
    await this.assessmentsRepository.save(assessment);
  }

  async checkOrCreateCandidate(params: FindCandidateInterface): Promise<Users> {
    let user: Users = await this.usersRepository.findOne({
      where: {
        email: params.email,
      },
    });
    if (!user) {
      const paramCreate: createCandidateInterface = plainToClass(Users, {
        email: params.email,
        role: RoleEnum.CANDIDATE,
      });
      user = await this.usersRepository.create(paramCreate);
      await this.usersRepository.save(user);
    }
    return user;
  }

  async inviteCandidate(inviteCandidateDto: InviteCandidateDto): Promise<void> {
    const { email, assessment_id } = inviteCandidateDto;

    // Check if the candidate already exists, if not create one
    let candidate: Users = await this.usersRepository.findOne({
      where: { email, role: RoleEnum.CANDIDATE },
    });
    if (!candidate) {
      candidate = await this.checkOrCreateCandidate({ email });
    }

    // Check if the assessment exists or is archived
    const assessment: Assessments = await this.assessmentsRepository.findOne({
      where: { id: assessment_id },
    });
    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }
    if (assessment.is_archived) {
      throw new NotFoundException('Assessment is archived');
    }

    // Create an invitation
    const invitation = this.invitationsRepository.create({
      candidate_id: candidate.id,
      assessment_id: assessment.id,
      status: InvitationStatusEnum.PENDING,
    });

    await this.invitationsRepository.save(invitation);

    // Send an email with the invitation link
    const invitationLink = `http://localhost:3000/assessments/invite/${invitation.id}`;
    await this.mailService
      .to(email)
      .subject('You are invited to participate in an assessment')
      .text(`Please click the following link to participate: ${invitationLink}`)
      .send();
  }

  async addCandidateToAssessment(assessment_id: number, candidate_id: number) {
    try {
      const assessment: Assessments = await this.assessmentsRepository.findOne({
        where: { id: assessment_id },
      });
      if (!assessment) {
        throw new NotFoundException('Assessment not found');
      }
      if (assessment.is_archived) {
        throw new NotFoundException('Assessment is archived');
      }

      const candidate: Users = await this.usersRepository.findOne({
        where: { id: candidate_id, role: RoleEnum.CANDIDATE },
        relations: ['assessments_candidates'],
      });

      if (!candidate) {
        throw new NotFoundException('Candidate not found');
      }

      candidate.assessments_candidates.push(assessment);
      await this.usersRepository.save(candidate);
    } catch (error) {
      console.log(error);
    }
  }

  // Candidate
  async joinAssessment(
    email: string,
    invitation_id: number,
  ): Promise<Invitations> {
    const invitation: Invitations = await this.invitationsRepository.findOne({
      where: { id: invitation_id, status: InvitationStatusEnum.PENDING },
      relations: ['assessment', 'user'],
    });
    if (!invitation) {
      throw new NotFoundException('Invitation not found or already accepted');
    }

    if (invitation.user.email !== email) {
      throw new NotFoundException('This email does not match the invitation');
    }

    invitation.status = InvitationStatusEnum.ACCEPTED;
    invitation.assessment.status = AssessmentStatusEnum.IDLE;
    await this.invitationsRepository.save(invitation);
    await this.assessmentsRepository.save(invitation.assessment);

    await this.addCandidateToAssessment(
      invitation.assessment_id,
      invitation.candidate_id,
    );

    return invitation;
  }

  async validateCandidate(candidateId: number, assessmentId: number) {
    const candidate = await this.usersRepository.query(
      `SELECT candidate_id FROM assessments_candidates WHERE candidate_id = ${candidateId} AND assessment_id = ${assessmentId}`,
    );
    if (candidate.length === 0) {
      throw new NotFoundException(
        'Candidate not found or not assigned in that assessment',
      );
    }
  }
}
