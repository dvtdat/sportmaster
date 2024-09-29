import { Migration } from '@mikro-orm/migrations';

export class Migration20240929143000 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user_type" ("id" serial primary key, "created_at" timestamptz not null default current_timestamp, "updated_at" timestamptz not null default current_timestamp, "name" text not null);`);

    this.addSql(`create table "user" ("id" serial primary key, "created_at" timestamptz not null default current_timestamp, "updated_at" timestamptz not null default current_timestamp, "name" text not null, "user_type_id" int not null);`);

    this.addSql(`create table "venue" ("id" serial primary key, "created_at" timestamptz not null default current_timestamp, "updated_at" timestamptz not null default current_timestamp, "name" text not null, "address" text not null, "phone" text null);`);

    this.addSql(`create table "event" ("id" serial primary key, "created_at" timestamptz not null default current_timestamp, "updated_at" timestamptz not null default current_timestamp, "name" text not null, "description" varchar(1000) null, "started_at" timestamptz not null, "ended_at" timestamptz not null, "venue_id" int not null);`);

    this.addSql(`create table "transaction" ("id" serial primary key, "created_at" timestamptz not null default current_timestamp, "updated_at" timestamptz not null default current_timestamp, "event_id" int not null, "description" varchar(1000) null, "completed" boolean not null default false, "amount" int not null default 0, "to_user_id" int not null, "from_user_id" int not null);`);

    this.addSql(`create table "event_attendees" ("event_id" int not null, "user_id" int not null, constraint "event_attendees_pkey" primary key ("event_id", "user_id"));`);

    this.addSql(`alter table "user" add constraint "user_user_type_id_foreign" foreign key ("user_type_id") references "user_type" ("id") on update cascade;`);

    this.addSql(`alter table "event" add constraint "event_venue_id_foreign" foreign key ("venue_id") references "venue" ("id") on update cascade;`);

    this.addSql(`alter table "transaction" add constraint "transaction_event_id_foreign" foreign key ("event_id") references "event" ("id") on update cascade;`);
    this.addSql(`alter table "transaction" add constraint "transaction_to_user_id_foreign" foreign key ("to_user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "transaction" add constraint "transaction_from_user_id_foreign" foreign key ("from_user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "event_attendees" add constraint "event_attendees_event_id_foreign" foreign key ("event_id") references "event" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "event_attendees" add constraint "event_attendees_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`);
  }

}
