import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity, Event, User } from './index';

/**
 * Represents a transaction entity.
 *
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       allOf:
 *         - $ref: '#/components/schemas/BaseEntity'
 *       properties:
 *         event:
 *           $ref: '#/components/schemas/Event'
 *         description:
 *           type: string
 *           maxLength: 1000
 *           nullable: true
 *         completed:
 *           type: boolean
 *         amount:
 *           type: number
 *           default: 0
 *         toUser:
 *           $ref: '#/components/schemas/User'
 *         fromUser:
 *           $ref: '#/components/schemas/User'
 *       required:
 *         - event
 *         - completed
 *         - amount
 *         - toUser
 *         - fromUser
 */
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
