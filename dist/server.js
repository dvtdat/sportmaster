"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.DI = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const postgresql_1 = require("@mikro-orm/postgresql");
const entities_1 = require("./entities");
const services_1 = require("./services");
const controllers_1 = require("./controllers");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.app = (0, express_1.default)();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
exports.DI = {};
exports.init = (async () => {
    exports.DI.orm = await postgresql_1.MikroORM.init();
    exports.DI.em = exports.DI.orm.em;
    exports.DI.user = exports.DI.orm.em.getRepository(entities_1.User);
    exports.DI.userType = exports.DI.orm.em.getRepository(entities_1.UserType);
    exports.DI.venue = exports.DI.orm.em.getRepository(entities_1.Venue);
    exports.DI.event = exports.DI.orm.em.getRepository(entities_1.Event);
    exports.DI.transaction = exports.DI.orm.em.getRepository(entities_1.Transaction);
    await exports.DI.orm.getMigrator().up();
    const emFork = exports.DI.orm.em.fork();
    exports.app.use(express_1.default.json());
    exports.app.use((req, res, next) => postgresql_1.RequestContext.create(exports.DI.orm.em, next));
    // Services
    const userService = new services_1.UserService(exports.DI.orm, emFork, exports.DI.user);
    const userTypeService = new services_1.UserTypeService(exports.DI.orm, emFork, exports.DI.userType);
    const venueService = new services_1.VenueService(exports.DI.orm, emFork, exports.DI.venue);
    const eventService = new services_1.EventService(exports.DI.orm, emFork, exports.DI.event);
    const transactionService = new services_1.TransactionService(exports.DI.orm, emFork, exports.DI.transaction);
    // Controllers
    exports.app.use('/users', new controllers_1.UserController(userService, userTypeService).router);
    exports.app.use('/user_types', new controllers_1.UserTypeController(userService, userTypeService).router);
    exports.app.use('/venues', new controllers_1.VenueController(venueService).router);
    exports.app.use('/events', new controllers_1.EventController(eventService, userService, venueService).router);
    exports.app.use('/transactions', new controllers_1.TransactionController(transactionService, eventService, userService)
        .router);
    exports.app.use((req, res) => {
        res.status(404).json({ message: 'No route found' });
    });
    exports.DI.server = exports.app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})();
