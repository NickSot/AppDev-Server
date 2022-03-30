import * as userModel from '../models/User';
import {User} from '../models/User';
import express, {request, Request, Response} from 'express';
import * as authModel from '../models/Auth'
import fs from 'fs';
import emailCheck from 'email-check';

const userRouter = express.Router();

userRouter.post('/register', (req: Request, res: Response) => {
    let newUser: User = req.body;

    newUser.avatar = Buffer.from(req.body.avatar, 'base64');

    emailCheck(newUser.email)
            .then(function (result) {
                if (result) {
                    userModel.create(newUser, (err: Error, insertId: number) => {
                        if (err) {
                            return res.status(500).json({
                                message: err.message
                            });
                        }
                
                        res.status(201).send("User created!");
                    });
                }

                else{
                    res.status(404).send('User email does not exists.');
                }
            })
            .catch(function (err) {
                if (err.message === 'refuse') {
                    res.status(500).send('error');
                } else {
                    res.status(500).send('anime waifu')
                }
            });
});



userRouter.post('/login', (req: Request, res: Response) => {

    if(authModel.checkCredentials(req.body.uNickname, req.body.uPassword)){

        userModel.login((req.body.uNickname), (req.body.uPassword), (err: Error, user?: User, uId?: number) => {

            if(err) {return res.send(err.message);}

            if((user != null) && (uId != null)){
    
                let userAvatar = user.avatar.toString('base64');
    
                userModel.wardList((uId), (err: Error, result: Array<object>) => {
    
                    if(err) return res.send(err.message);

                    console.log(result);
            
                    res.status(200).send({
                        "uId": user.id,
                        "email": user.email,
                        "nickname": user.nickname,
                        "password": user.password,
                        "avatar": userAvatar,
                        "gender": user.gender,
                        "oauthToken": user.OauthToken,
                        "wardList": result
                    });
                });
            }
            
            else{
                res.status(404).send("User not found");
            }
            
        });
    }
    else{
        res.status(400).send("Data provided not sufficient!");
    }
});


userRouter.post('/getInfo', (req: Request, res: Response) => {

    if(authModel.checkCredentials(req.body.uNickname, req.body.uPassword)){

        authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
            if(err) return res.send(err.message);
    
            if(uIdRes != null){
                userModel.find((uIdRes), (err: Error, user: User) => {
    
                    let userAvatar = user.avatar.toString('base64');
            
                    userModel.wardList((uIdRes), (err: Error, result: Array<object>) => {
    
                        if(err) return res.send(err.message);
            
                        res.status(200).send({
                            "uId": uIdRes,
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
    }
    else{
        res.status(400).send("Data provided not sufficient!");
    }
});

userRouter.delete('/delUser', (req:Request, res:Response) => {

    if(authModel.checkCredentials(req.body.uNickname, req.body.uPassword)){

        authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
            if(err) return res.send(err.message);
    
            if(uIdRes != null){
                userModel.remove((uIdRes), (err: Error, affectedRows: number) => {
                    if (err) return res.send(err.message);
            
                    if (affectedRows > 0) {
                        res.status(200).send('Success!');
                    }
                });
            }
            else{
                res.status(403).send('Unauthorised access request!');
            }
    
        });
    }
    else{
        res.status(400).send("Data provided not sufficient!");
    }
});

userRouter.put('/register/update', (req:Request, res:Response) => {

    if(authModel.checkCredentials(req.body.uNickname, req.body.uPassword)){

        let updatedUser: User = req.body;

        updatedUser.avatar = Buffer.from(req.body.avatar, 'base64');
    
        authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
            if(err) return res.send(err.message);
            
            if(uIdRes != null){
                userModel.update((uIdRes), (updatedUser), (err: Error, affectedRows: number) => {
                    if (err) return res.send(err.message);
            
                    if(affectedRows > 0){
                        res.status(200).send('Success!');
                    }
                });
            }
            else{
                res.status(403).send('Unauthorised access request!');
            }
    
        });
    }
    else{
        res.status(400).send("Data provided not sufficient!");
    }
});

userRouter.post('/register/addWardrobe', (req:Request, res:Response) => {
    
    if(authModel.checkCredentials(req.body.uNickname, req.body.uPassword)){

        authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
            if(err) return res.send(err.message);
            
            if(uIdRes != null){

                authModel.verifyWardrobe((uIdRes), (req.body.wId), (err: Error, valid: boolean) => {
                    if(err) return res.send(err.message);
                    
                    if (!valid){
                        authModel.verifyWardrobeShared(req.body.wId, (err: Error, valid: boolean) => {
                            if (err) return res.send(err.message);

                            if(valid){
                                userModel.userToWardrobe((uIdRes), (req.body.wId), (err:Error, affectedRows: number) => {
                                    if (err) return res.send(err.message);
                            
                                    if(affectedRows > 0){
                                        res.status(200).send('Success!');
                                    }
                                });
                            }
                            else{
                                res.send(409).send('This wardrobe cannot be accessed!');
                            }
                        });
                    }
                    else {
                        res.status(409).send("User is already registered to wardrobe!");
                    }
                });
            }
            else{
                res.status(403).send('Unauthorised access request!');
            }
        });
    }
    else{
        res.status(400).send("Data provided not sufficient!");
    }
});

userRouter.delete('/register/delWardrobe', (req:Request, res:Response) => {

    if(authModel.checkCredentials(req.body.uNickname, req.body.uPassword)){

        authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
            if(err) return res.send(err.message);
            
            if(uIdRes != null){

                authModel.verifyWardrobe((uIdRes), (req.body.wId), (err: Error, valid: boolean) => {
                    if(err) return res.send(err.message);
    
                    if(valid){

                        userModel.userDelFromWardrobe((uIdRes), (req.body.wId), (err:Error, affectedRows: number) => {
                            if (err) res.send(err.message);
                    
                                res.status(200).send('Success!');
                        });
                    }
                    else{
                        res.status(409).send("User is already not registered to wardrobe!");
                    }
                });
            }
            else{
                res.status(403).send('Unauthorised access request!');
            }
        });
    }
    else{
        res.status(400).send("Data provided not sufficient!");
    }
});

export {userRouter};