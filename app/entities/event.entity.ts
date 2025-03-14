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
 *     Event:
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
 *             $ref: '#/components/schemas/User'
 *           description: The list of users attending the event.
 *         transactions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Transaction'
 *           description: The list of transactions associated with the event.
 */

/**
 * Represents an event entity.
 *
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - name
 *         - startedAt
 *         - endedAt
 *         - venue
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
 *             $ref: '#/components/schemas/User'
 *           description: The list of users attending the event.
 *         transactions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Transaction'
 *           description: The list of transactions associated with the event.
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
