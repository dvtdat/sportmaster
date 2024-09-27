import { defineConfig } from '@mikro-orm/core';

export default defineConfig({
  dbName: 'sportmaster',
  debug: true,
  entities: ['src/entities/**/*.ts'],
});
