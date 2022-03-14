import * as userModel from '../models/User';
import {User} from '../models/User';
import express, {request, Request, Response} from 'express';
import * as authModel from '../models/Auth'
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

        res.status(201).send("User created!");
    });
});

userRouter.get('/login/', (req: Request, res: Response) => {
    userModel.login((req.body.uNickname), (req.body.uPassword), (err: Error, user?: User) => {

        if(user != null){

            let userAvatar = user.avatar.toString('base64');

            res.status(200).send({
                "email": user.email,
                "nickname": user.nickname,
                "password": user.password,
                "avatar": userAvatar,
                "gender": user.gender,
                "oauthToken": user.OauthToken
            });
        }
        
        else{
            res.status(404).send("User not found");
        }
        
    });
});


userRouter.get('/getInfo', (req: Request, res: Response) => {

    authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
        if(err) res.send(err.message);

        if(uIdRes != null){
            userModel.find((uIdRes), (err: Error, user: User) => {

                let userAvatar = user.avatar.toString('base64');
        
                userModel.wardList((uIdRes), (err: Error, result: Array<number>) => {
        
                    res.status(200).send({
                        "email": user.email,
                        "nickname": user.nickname,
                        "password": user.password,
                        "avatar": userAvatar,
                        "gender": user.gender,
                        "oauthToken": user.OauthToken,
                        "wardList": result
                    });
                });
            });
        }
        else{
            res.status(404).send('User not found');
        }

    });
});

userRouter.delete('/delUser', (req:Request, res:Response) => {

    authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
        if(err) res.send(err.message);

        if(uIdRes != null){
            userModel.remove((uIdRes), (err: Error, affectedRows: number) => {
                if (err) res.send(err.message);
        
                if (affectedRows > 0) {
                    res.status(200).send('Success!');
                }
            });
        }
        else{
            res.status(401).send('Unauthorised access request!');
        }

    });
});

userRouter.put('/register/update', (req:Request, res:Response) => {
    let updatedUser: User = req.body;

    updatedUser.avatar = Buffer.from(req.body.avatar, 'base64');

    authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
        if(err) res.send(err.message);
        
        if(uIdRes != null){
            userModel.update((uIdRes), (updatedUser), (err: Error, affectedRows: number) => {
                if (err) res.send(err.message);
        
                if(affectedRows > 0){
                    res.status(200).send('Success!');
                }
            });
        }
        else{
            res.status(401).send('Unauthorised access request!');
        }

    });
});

userRouter.post('/register/addWardrobe', (req:Request, res:Response) => {

    authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
        if(err) res.send(err.message);
        
        if(uIdRes != null){
            userModel.userToWardrobe((uIdRes), (req.body.wId), (err:Error, affectedRows: number) => {
                if (err) res.send(err.message);
        
                if(affectedRows > 0){
                    res.status(200).send('Success!');
                }
            });

        }
        else{
            res.status(401).send('Unauthorised access request!');
        }
    });
});

userRouter.delete('/register/delWardrobe', (req:Request, res:Response) => {

    authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
        if(err) res.send(err.message);
        
        if(uIdRes != null){
            userModel.userDelFromWardrobe((uIdRes), (req.body.wId), (err:Error, affectedRows: number) => {
                if (err) res.send(err.message);
        
                    res.status(200).send('Success!');
            });
        }
        else{
            res.status(401).send('Unauthorised access request!');
        }
    });
});

export {userRouter};