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
/**
 * @swagger
 * components:
 *   schemas:
 *     EventTransaction:
 *       type: object
 *       allOf:
 *         - $ref: '#/components/schemas/BaseEntity'
 *       properties:
 *         event:
 *           type: number
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
 *           type: number
 *           description: The ID of the user receiving the transaction.
 *         fromUser:
 *           type: number
 *           description: The ID of the user sending the transaction.
 *       required:
 *         - event
 *         - completed
 *         - amount
 *         - toUser
 *         - fromUser
 *
 *     Event:
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
 *           description: The list of user IDs attending the event.
 *         transactions:
 *           type: array
 *           items:
 *             type: integer
 *           description: The list of transaction IDs associated with the event.
 */

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
