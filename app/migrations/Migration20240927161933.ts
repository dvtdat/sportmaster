import { Migration } from '@mikro-orm/migrations';

export class Migration20240927161933 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user_type" ("id" serial primary key, "created_at" timestamptz not null default current_timestamp, "updated_at" timestamptz not null default current_timestamp, "name" text not null);`);

    this.addSql(`create table "user" ("id" serial primary key, "created_at" timestamptz not null default current_timestamp, "updated_at" timestamptz not null default current_timestamp, "name" text not null, "user_type_id" int not null);`);

    this.addSql(`alter table "user" add constraint "user_user_type_id_foreign" foreign key ("user_type_id") references "user_type" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" drop constraint "user_user_type_id_foreign";`);

    this.addSql(`drop table if exists "user_type" cascade;`);

    this.addSql(`drop table if exists "user" cascade;`);
  }

}
