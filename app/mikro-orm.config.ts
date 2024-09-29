import { defineConfig, PostgreSqlDriver, Utils } from '@mikro-orm/postgresql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Migrator, TSMigrationGenerator } from '@mikro-orm/migrations';
import { BaseEntity, User, UserType } from './entities/index';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  driver: PostgreSqlDriver,
  host: process.env.HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  user: process.env.DB_USER,
  dbName: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,

  entities: [BaseEntity, User, UserType],
  debug: true,
  highlighter: new SqlHighlighter(),
  extensions: [Migrator],
  migrations: {
    path: Utils.detectTsNode() ? 'api/migrations' : 'dist/migrations',
    tableName: 'mikro_orm_migrations', // name of database table with log of executed transactions
    glob: '!(*.d).{js,ts}', // how to match migration files (all .js and .ts files, but not .d.ts)
    transactional: true, // wrap each migration in a transaction
    disableForeignKeys: false, // wrap statements with `set foreign_key_checks = 0` or equivalent
    allOrNothing: true, // wrap all migrations in master transaction
    dropTables: true, // allow to disable table dropping
    safe: false, // allow to disable table and column dropping
    snapshot: true, // save snapshot when creating new migrations
    emit: 'ts', // migration generation mode
    generator: TSMigrationGenerator, // migration generator, e.g. to allow custom formatting
  },
});
