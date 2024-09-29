import {
  Entity,
  Collection,
  Property,
  t,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from '@mikro-orm/core';
import { Venue, User, BaseEntity, Transaction } from './index';

@Entity()
export class Event extends BaseEntity {
  @Property({ type: t.text })
  name!: string;

  @Property({ length: 1000, nullable: true })
  description!: string;

  @Property({ type: 'timestamptz' })
  startedAt = new Date();

  @Property({ type: 'timestamptz' })
  endedAt = new Date();

  @ManyToOne({ entity: () => Venue })
  venue!: Venue;

  @ManyToMany({ entity: () => User, inversedBy: 'events' })
  attendees = new Collection<User>(this);

  @OneToMany(() => Transaction, (transaction) => transaction.event)
  transactions = new Collection<Transaction>(this);

  constructor(name: string, startedAt: Date, endedAt: Date, venue: Venue) {
    super();
    this.name = name;
    this.startedAt = startedAt;
    this.endedAt = endedAt;
    this.venue = venue;
  }
}
