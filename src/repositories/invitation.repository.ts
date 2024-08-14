import { Injectable } from '@nestjs/common';
import { InvitationsEntity } from '../entities';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class InvitationsRepository extends Repository<InvitationsEntity> {
  constructor(private dataSource: DataSource) {
    super(InvitationsEntity, dataSource.createEntityManager());
  }
}
