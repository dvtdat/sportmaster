import { Entity, OneToMany, Property, Collection, t } from '@mikro-orm/core';
import { User, BaseEntity } from './index';

export const predefinedUserTypes = ['Organizer', 'External', 'Vendor'];

/**
 * @swagger
 * components:
 *   schemas:
 *     UserType:
 *       allOf:
 *         - $ref: '#/components/schemas/BaseEntity'
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user type.
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
