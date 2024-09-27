"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.DI = exports.app = void 0;
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const postgresql_1 = require("@mikro-orm/postgresql");
const entities_1 = require("./entities");
const services_1 = require("./services");
const controllers_1 = require("./controllers");
exports.app = (0, express_1.default)();
const port = 3000;
exports.DI = {};
exports.init = (async () => {
    exports.DI.orm = await postgresql_1.MikroORM.init();
    exports.DI.em = exports.DI.orm.em;
    exports.DI.user = exports.DI.orm.em.getRepository(entities_1.User);
    exports.DI.userType = exports.DI.orm.em.getRepository(entities_1.UserType);
    await exports.DI.orm.getMigrator().up();
    const emFork = exports.DI.orm.em.fork();
    exports.app.use(express_1.default.json());
    exports.app.use((req, res, next) => postgresql_1.RequestContext.create(exports.DI.orm.em, next));
    // Services
    const userService = new services_1.UserService(exports.DI.orm, emFork, exports.DI.user);
    const userTypeService = new services_1.UserTypeService(exports.DI.orm, emFork, exports.DI.userType);
    // Controllers
    exports.app.use('/users', new controllers_1.UserController(userService, userTypeService).router);
    exports.app.use('/user_types', new controllers_1.UserTypeController(userService, userTypeService).router);
    exports.app.use((req, res) => {
        res.status(404).json({ message: 'No route found' });
    });
    exports.DI.server = http_1.default.createServer(exports.app);
    exports.DI.server.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
})();
