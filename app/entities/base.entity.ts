import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

/**
 * @swagger
 * components:
 *   schemas:
 *     BaseEntity:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the entity
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the entity was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the entity was last updated
 */

/**
 * Abstract base class for all entities.
 *
 * @abstract
 */
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
