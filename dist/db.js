"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqlClient = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const fs_1 = __importDefault(require("fs"));
const sql_password = JSON.parse(fs_1.default.readFileSync('./sql_credentials.json').toString())['password'];
exports.sqlClient = mysql2_1.default.createConnection({
    host: 'localhost',
    user: 'root',
    password: sql_password,
    database: 'OurWardrobeDB',
    port: 3306
});
//# sourceMappingURL=db.js.map