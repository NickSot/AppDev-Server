"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const UserRouter_1 = require("./routers/UserRouter");
const WardrobeRouter_1 = require("./routers/WardrobeRouter");
const ClothRouter_1 = require("./routers/ClothRouter");
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ limit: "5mb", extended: true }));
app.use(body_parser_1.default.json({ limit: "5mb" }));
app.use('/users', UserRouter_1.userRouter);
app.use('/wardrobes', WardrobeRouter_1.wardrobeRouter);
app.use('/clothes', ClothRouter_1.clothRouter);
app.get('/', (req, res) => {
    res.send('Sever is up and running!');
});
app.listen(3000);
//# sourceMappingURL=index.js.map