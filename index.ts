import express from "express"

const app = express();

app.get('/', (req, res) => {
    res.send('Sever is up and running!')
});

app.listen(3000);