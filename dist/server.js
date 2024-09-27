"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.app = void 0;
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
const port = 3000;
exports.init = (async () => {
    exports.app.get('/', (req, res) => {
        res.send('Hello World');
    });
    const server = http_1.default.createServer(exports.app);
    server.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
})();
