import { Entity, OneToMany, Property, Collection, t } from '@mikro-orm/core';
import { User, BaseEntity } from './index';

export const predefinedUserTypes = ['Organizer', 'External', 'Vendor'];

/**
 * @swagger
 * components:
 *   schemas:
 *     UserType:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user type.
 *         users:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *           description: The collection of users associated with this user type.
 */

/**
 * Represents a type of user in the system.
 *
 * @class UserType
 * @extends BaseEntity
 *
 * @property {string} name - The name of the user type.
 * @property {Collection<User>} users - The collection of users associated with this user type.
 *
 * @constructor
 * @param {string} name - The name of the user type.
 */
@Entity()
export class UserType extends BaseEntity {
  @Property({ type: t.text })
  name!: string;

  @OneToMany({ entity: () => User, mappedBy: 'userType' })
  users = new Collection<User>(this);

  constructor(name: string) {
    super();
    this.name = name;
  }
}
