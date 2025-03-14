import { Entity, Property, t } from '@mikro-orm/core';
import { BaseEntity } from './index';

/**
 * Represents a venue entity.
 *
 * @swagger
 * components:
 *   schemas:
 *     Venue:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the venue.
 *         address:
 *           type: string
 *           description: The address of the venue.
 *         phone:
 *           type: string
 *           nullable: true
 *           description: The phone number of the venue.
 */
@Entity()
export class Venue extends BaseEntity {
  @Property({ type: t.text })
  name!: string;

  @Property({ type: t.text })
  address!: string;

  @Property({ type: t.text, nullable: true })
  phone!: string;
}
