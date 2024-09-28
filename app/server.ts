import http from 'http';
import express from 'express';
import {
  EntityManager,
  EntityRepository,
  MikroORM,
  RequestContext,
} from '@mikro-orm/postgresql';
import mikroOrmConfig from './mikro-orm.config';
import { User, UserType } from './entities';
import { UserService, UserTypeService } from './services';
import { UserController, UserTypeController } from './controllers';
import dotenv from 'dotenv';

dotenv.config();

export const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : undefined;

export const DI = {} as {
  server: http.Server;
  orm: MikroORM;
  em: EntityManager;
  user: EntityRepository<User>;
  userType: EntityRepository<UserType>;
};

export const init = (async () => {
  DI.orm = await MikroORM.init();
  DI.em = DI.orm.em;
  DI.user = DI.orm.em.getRepository(User);
  DI.userType = DI.orm.em.getRepository(UserType);

  await DI.orm.getMigrator().up();

  const emFork = DI.orm.em.fork();
  app.use(express.json());
  app.use((req, res, next) => RequestContext.create(DI.orm.em, next));

  // Services
  const userService = new UserService(DI.orm, emFork, DI.user);
  const userTypeService = new UserTypeService(DI.orm, emFork, DI.userType);

  // Controllers
  app.use('/users', new UserController(userService, userTypeService).router);
  app.use(
    '/user_types',
    new UserTypeController(userService, userTypeService).router
  );

  app.use((req, res) => {
    res.status(404).json({ message: 'No route found' });
  });

  DI.server = http.createServer(app);
  DI.server.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
  });
})();
