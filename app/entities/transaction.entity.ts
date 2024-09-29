import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity, Event, User } from './index';

@Entity()
export class Transaction extends BaseEntity {
  @ManyToOne({ entity: () => Event })
  event!: Event;

  @Property({ length: 1000, nullable: true })
  description: string;

  @Property({ type: 'boolean' })
  completed!: boolean;

  @Property({ type: 'number', default: 0 })
  amount!: number;

  @ManyToOne({ entity: () => User })
  toUser!: User;

  @ManyToOne({ entity: () => User })
  fromUser!: User;

  constructor(
    event: Event,
    description: string,
    amount: number,
    toUser: User,
    fromUser: User
  ) {
    super();
    this.event = event;
    this.description = description;
    this.amount = amount;
    this.completed = false;
    this.toUser = toUser;
    this.fromUser = fromUser;
  }
}
