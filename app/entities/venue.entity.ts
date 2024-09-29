import { Entity, Property, t } from '@mikro-orm/core';
import { BaseEntity } from './index';

@Entity()
export class Venue extends BaseEntity {
  @Property({ type: t.text })
  name!: string;

  @Property({ type: t.text })
  address!: string;

  @Property({ type: t.text, nullable: true })
  phone!: string;
}
