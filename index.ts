import express from 'express';
import bodyParser from 'body-parser';
import {userRouter} from './routers/UserRouter';
import {wardrobeRouter} from './routers/WardrobeRouter';
import {clothRouter} from './routers/ClothRouter';

const app = express();

app.use(bodyParser.urlencoded({limit: "5mb", extended: true}));
app.use(bodyParser.json({limit: "5mb"}));
app.use('/users', userRouter);
app.use('/wardrobes', wardrobeRouter);
app.use('/clothes', clothRouter);

app.get('/', (req, res) => {
    res.send('Sever is up and running!')
});

app.listen(3000);