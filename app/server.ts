import http from 'http';
import express from 'express';
import { EntityManager, MikroORM } from '@mikro-orm/postgresql';

export const app = express();
const port = 3000;

export const DI = {} as {
  server: http.Server;
  orm: MikroORM;
  em: EntityManager;
};

export const init = (async () => {
  app.get('/', (req, res) => {
    res.send('Hello World');
  });

  const server = http.createServer(app);
  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
})();
