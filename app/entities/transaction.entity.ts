import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity, Event, User } from './index';

/**
 * Represents a transaction entity.
 *
 * @swagger
 * components:
 *   schemas:
 *     EventSummary:
 *       allOf:
 *         - $ref: '#/components/schemas/BaseEntity'
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the event.
 *         description:
 *           type: string
 *           description: A brief description of the event.
 *         startedAt:
 *           type: string
 *           format: date-time
 *           description: The start date and time of the event.
 *         endedAt:
 *           type: string
 *           format: date-time
 *           description: The end date and time of the event.
 *         venue:
 *           $ref: '#/components/schemas/Venue'
 *           description: The venue where the event is held.
 *         attendees:
 *           type: array
 *           items:
 *             type: integer
 *         transactions:
 *           type: array
 *           items:
 *             type: integer
 *     Transaction:
 *       type: object
 *       allOf:
 *         - $ref: '#/components/schemas/BaseEntity'
 *       properties:
 *         event:
 *           $ref: '#/components/schemas/EventSummary'
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
 *           type: integer
 *         fromUser:
 *           type: integer
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
