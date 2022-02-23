import mysql from 'mysql2';
import fs from 'fs';

const sql_password = JSON.parse(fs.readFileSync('./sql_credentials.json').toString())['password'];

export const sqlClient = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: sql_password,
    database: 'OurWardrobeDB'
});