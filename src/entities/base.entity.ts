import { BeforeInsert, BeforeUpdate, Column } from 'typeorm';

export class BaseEntity {
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @BeforeInsert()
  setCreatedAt(): void {
    this.created_at = new Date();
  }

  @BeforeUpdate()
  setUpdatedAt(): void {
    this.updated_at = new Date();
  }
}
