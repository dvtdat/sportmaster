import { Migration } from '@mikro-orm/migrations';

export class Migration20240929090159 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "venue" ("id" serial primary key, "created_at" timestamptz not null default current_timestamp, "updated_at" timestamptz not null default current_timestamp, "name" text not null, "address" text not null, "phone" text null);`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "venue" cascade;`);
  }

}
