/// <reference types="node" />
import http from 'http';
import { EntityManager, EntityRepository, MikroORM } from '@mikro-orm/postgresql';
import { User, UserType } from './entities';
export declare const app: import("express-serve-static-core").Express;
export declare const DI: {
    server: http.Server;
    orm: MikroORM;
    em: EntityManager;
    user: EntityRepository<User>;
    userType: EntityRepository<UserType>;
};
export declare const init: Promise<void>;
