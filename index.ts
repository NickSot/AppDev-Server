import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.post('/login', (req, res) => {
    res.send(req.body);
    // res.send('we have a big problem');
});

app.get('/', (req, res) => {
    res.send('Sever is up and running!')
});

app.listen(3000);