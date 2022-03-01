import * as userModel from '../models/User';
import {User} from '../models/User';
import express, {request, Request, Response} from 'express';
import fs from 'fs';

const userRouter = express.Router();

userRouter.post('/register', (req: Request, res: Response) => {
    let newUser: User = req.body;

    newUser.avatar = Buffer.from(req.body.avatar, 'base64');

    userModel.create(newUser, (err: Error, insertId: number) => {
        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        res.status(200).json({
            message: 'Success!',
            uId: insertId
        });
    });
});

userRouter.get('/:id', (req: Request, res: Response) => {
    userModel.find(+(req.params.id), (err: Error, user: User) => {

        let userAvatar = user.avatar.toString('base64');

        res.status(200).send({
            "email": user.email,
            "nickname": user.nickname,
            "password": user.password,
            "avatar": userAvatar,
            "gender": user.gender,
            "oauthToken": user.OauthToken
        });
    });
});

userRouter.delete('/:id', (req:Request, res:Response) => {
    userModel.remove(+(req.params.id), (err: Error, affectedRows: number) => {
        if (err) res.send(err.message);

        if (affectedRows > 0) {
            res.status(200).send('Success!');
        }
    });
});

userRouter.put('/register/:id', (req:Request, res:Response) => {
    let updatedUser: User = req.body;

    updatedUser.avatar = Buffer.from(req.body.avatar, 'base64');

    userModel.update(+(req.params.id), (updatedUser), (err: Error, affectedRows: number) => {
        if (err) res.send(err.message);

        if(affectedRows > 0){
            res.status(200).send('Success!');
        }
    });
});

export {userRouter};