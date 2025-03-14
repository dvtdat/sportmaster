import {
  Entity,
  Property,
  ManyToOne,
  t,
  OneToMany,
  Collection,
  ManyToMany,
} from '@mikro-orm/core';
import { BaseEntity, UserType, Transaction, Event } from './index';
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       allOf:
 *         - $ref: '#/components/schemas/BaseEntity'
 *         - type: object
 *           properties:
 *             name:
 *               type: string
 *               description: The name of the user.
 *             userType:
 *               $ref: '#/components/schemas/UserType'
 *               description: The type of the user.
 *             events:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *               description: The events the user is attending.
 *             sentTransactions:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *               description: The transactions sent by the user.
 *             receivedTransactions:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *               description: The transactions received by the user.
 */

@Entity()
export class User extends BaseEntity {
  @Property({ type: t.text })
  name!: string;

  @ManyToOne({ entity: () => UserType })
  userType!: UserType;

  @ManyToMany({ entity: () => Event, mappedBy: 'attendees' })
  events = new Collection<Event>(this);

  @OneToMany(() => Transaction, (transaction) => transaction.fromUser)
  sentTransactions = new Collection<Transaction>(this);

  @OneToMany(() => Transaction, (transaction) => transaction.toUser)
  receivedTransactions = new Collection<Transaction>(this);

  constructor(name: string, userType: UserType) {
    super();
    this.name = name;
    this.userType = userType;
  }
}
