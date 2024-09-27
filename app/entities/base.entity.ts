import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ abstract: true })
export abstract class BaseEntity {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'timestamptz', defaultRaw: 'current_timestamp' })
  createdAt = new Date();

  @Property({
    type: 'timestamptz',
    onUpdate: () => new Date(),
    defaultRaw: 'current_timestamp',
  })
  updatedAt = new Date();
}
