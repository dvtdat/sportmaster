import http from 'http';
import express from 'express';
import {
  EntityManager,
  EntityRepository,
  MikroORM,
  RequestContext,
} from '@mikro-orm/postgresql';
import mikroOrmConfig from './mikro-orm.config';
import { User, UserType, Venue, Event, Transaction } from './entities';
import {
  UserService,
  UserTypeService,
  VenueService,
  EventService,
  TransactionService,
} from './services';
import {
  UserController,
  UserTypeController,
  VenueController,
  EventController,
  TransactionController,
} from './controllers';
import dotenv from 'dotenv';

dotenv.config();

export const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

export const DI = {} as {
  server: http.Server;
  orm: MikroORM;
  em: EntityManager;
  user: EntityRepository<User>;
  userType: EntityRepository<UserType>;
  venue: EntityRepository<Venue>;
  event: EntityRepository<Event>;
  transaction: EntityRepository<Transaction>;
};

export const init = (async () => {
  DI.orm = await MikroORM.init();
  DI.em = DI.orm.em;
  DI.user = DI.orm.em.getRepository(User);
  DI.userType = DI.orm.em.getRepository(UserType);
  DI.venue = DI.orm.em.getRepository(Venue);
  DI.event = DI.orm.em.getRepository(Event);
  DI.transaction = DI.orm.em.getRepository(Transaction);

  await DI.orm.getMigrator().up();

  const emFork = DI.orm.em.fork();
  app.use(express.json());
  app.use((req, res, next) => RequestContext.create(DI.orm.em, next));

  // Services
  const userService = new UserService(DI.orm, emFork, DI.user);
  const userTypeService = new UserTypeService(DI.orm, emFork, DI.userType);
  const venueService = new VenueService(DI.orm, emFork, DI.venue);
  const eventService = new EventService(DI.orm, emFork, DI.event);
  const transactionService = new TransactionService(
    DI.orm,
    emFork,
    DI.transaction
  );

  // Controllers
  app.use('/users', new UserController(userService, userTypeService).router);
  app.use(
    '/user_types',
    new UserTypeController(userService, userTypeService).router
  );
  app.use('/venues', new VenueController(venueService).router);
  app.use(
    '/events',
    new EventController(eventService, userService, venueService).router
  );
  app.use(
    '/transactions',
    new TransactionController(transactionService, eventService, userService)
      .router
  );

  app.use((req, res) => {
    res.status(404).json({ message: 'No route found' });
  });

  DI.server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})();
