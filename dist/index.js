"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const UserRouter_1 = require("./routers/UserRouter");
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use('/users', UserRouter_1.userRouter);
app.get('/', (req, res) => {
    res.send('Sever is up and running!');
});
app.listen(3000);
//# sourceMappingURL=index.js.map