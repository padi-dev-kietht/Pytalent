import { RoleEnum } from '@enum/role.enum';

export interface UserModel {
  id: number;
  email: string;
  password: string;
}
export interface FindUserInterface {
  email: string;
  password: string;
}

export interface FindCandidateInterface {
  email: string;
}

export interface createUserInterface extends FindUserInterface {
  role: RoleEnum;
}

export interface createCandidateInterface extends FindCandidateInterface {
  role: RoleEnum;
}

export type UserGetResponse = Omit<UserModel, 'userId' | 'password'>;
