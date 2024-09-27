import { Entity, OneToMany, Property, Collection, t } from '@mikro-orm/core';
import { User, BaseEntity } from './index';

export const predefinedUserTypes = ['Organizer', 'External', 'Vendor'];

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
