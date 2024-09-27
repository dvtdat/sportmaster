import { Entity, Property, ManyToOne, t } from '@mikro-orm/core';
import { BaseEntity, UserType } from './index';

@Entity()
export class User extends BaseEntity {
  @Property({ type: t.text })
  name!: string;

  @ManyToOne({ entity: () => UserType })
  userType!: UserType;

  // @ManyToMany({ entity: () => Event, mappedBy: 'attendees' })
  // events = new Collection<Event>(this);

  // @OneToMany(() => Transaction, (transaction) => transaction.fromUser)
  // sentTransactions = new Collection<Transaction>(this);

  // @OneToMany(() => Transaction, (transaction) => transaction.toUser)
  // receivedTransactions = new Collection<Transaction>(this);

  constructor(name: string, userType: UserType) {
    super();
    this.name = name;
    this.userType = userType;
  }
}
