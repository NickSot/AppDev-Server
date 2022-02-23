import express from 'express';
import bodyParser from 'body-parser';
import sql from 'mysql';
import fs from 'fs';

const password = JSON.parse(fs.readFileSync('./sql_credentials.json').toString())['password'];

const conn = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: password,
    database: 'OurWardrobeDB'
});

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.post('/login', (req, res) => {
    conn.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
    });
    

    res.send(req.body);
});

app.get('/', (req, res) => {
    res.send('Sever is up and running!')
});

app.listen(3000);