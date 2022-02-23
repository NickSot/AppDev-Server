"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mysql_1 = __importDefault(require("mysql"));
const fs_1 = __importDefault(require("fs"));
const password = JSON.parse(fs_1.default.readFileSync('./sql_credentials.json').toString())['password'];
const conn = mysql_1.default.createConnection({
    host: 'localhost',
    user: 'root',
    password: password,
    database: 'OurWardrobeDB'
});
conn.connect(function (err) {
    if (err)
        throw err;
    console.log("Connected!");
});
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.post('/login', (req, res) => {
    res.send(req.body);
});
app.get('/', (req, res) => {
    res.send('Sever is up and running!');
});
app.listen(3000);
//# sourceMappingURL=index.js.map