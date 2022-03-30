import * as wardrobeModel from '../models/Wardrobe';
import {Wardrobe} from '../models/Wardrobe';
import express, {request, Request, Response} from 'express';
import * as authModel from '../models/Auth'
import fs from 'fs';

const wardrobeRouter = express.Router();

wardrobeRouter.post('/register', (req: Request, res: Response) => {

    if(authModel.checkCredentials(req.body.uNickname, req.body.uPassword)){

        authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
            if(err) {return res.send(err.message);}
    
            if(uIdRes != null){
    
                let newWardrobe: Wardrobe = req.body;
                newWardrobe.uId = uIdRes;
                newWardrobe.adminId = uIdRes;
    
                wardrobeModel.create(newWardrobe, (err: Error, insertId: number) => {
                    if (err) {
                        return res.status(500).json({
                            message: err.message
                        });
                    }
            
                    res.status(201).json({
                        message: 'Wardrobe created!',
                        wId: insertId
                    });
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

wardrobeRouter.delete('/:id', (req:Request, res:Response) => {

    if(authModel.checkCredentials(req.body.uNickname, req.body.uPassword)){

        authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
            if(err) {return res.send(err.message);}
    
            if(uIdRes != null){
    
                authModel.verifyWardrobe((uIdRes), +(req.params.id), (err: Error, valid: boolean) => {
    
                    if(valid){

                        authModel.checkAdmin(+(req.params.id),(uIdRes),(err: Error, admin: boolean) => {
                            if (err) {return res.send(err.message);}
                            else{
                                if(admin){
                                    wardrobeModel.remove(+(req.params.id), (err: Error, affectedRows: number) => {
                                        if (err) {return res.send(err.message);}
                                
                                        if (affectedRows > 0) {
                                            res.status(200).send('Success!');
                                        }
                                    });
                                }
                                else{
                                    res.status(401).send("User is not authorised to perform this action!");
                                }
                            }
                    
                        });
                    }
                    else{
                        res.status(401).send("User is not authorised to perform this action!");
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

wardrobeRouter.post('/:id', (req: Request, res: Response) => {

    if(authModel.checkCredentials(req.body.uNickname, req.body.uPassword)){

        authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
            if(err) {return res.send(err.message);}
    
            if(uIdRes != null){
    
                authModel.verifyWardrobe((uIdRes), +(req.params.id), (err: Error, valid: boolean) => {
                    if(err) {return res.send(err.message);}
    
                    if(valid){
    
                        wardrobeModel.find(+(req.params.id), (err: Error, wardrobe: Wardrobe) => {
    
                            wardrobeModel.clothList(+(req.params.id), (err: Error, result: Array<object>) =>{
                                
                                if(err) {return res.send(err.message);}

                                wardrobeModel.userList(+(req.params.id),(err: Error, userRes: Array<object>) =>{
                                    if(err) {return res.send(err.message);}

                                    res.status(200).send({
                                        'nickname': wardrobe.nickname,
                                        'creationTime': wardrobe.creationTime,
                                        'wardrobeType': wardrobe.wardrobeType,
                                        'AdminId': wardrobe.adminId,
                                        'clothList': result,
                                        'userList':userRes
                                    });
                                });
                            });
                        });
    
                    }
                    else{
                        res.status(401).send("User is not authorised to perform this action!");
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

wardrobeRouter.put('/register/:id', (req:Request, res:Response) => {

    if(authModel.checkCredentials(req.body.uNickname, req.body.uPassword)){

        authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
            if(err) {return res.send(err.message);}
        
            if(uIdRes != null){
    
                authModel.verifyWardrobe((uIdRes), +(req.params.id), (err: Error, valid: boolean) => {
    
                    if(valid){

                        authModel.checkAdmin(+(req.params.id),(uIdRes),(err: Error, admin: boolean) => {
                            if(err) {return res.send(err.message);}
                            else{
                                if(admin){

                                    let updatedWardrobe: Wardrobe = req.body;
                                    updatedWardrobe.uId = uIdRes;
                            
                                    wardrobeModel.update(+(req.params.id), (updatedWardrobe), (err: Error, affectedRows: number) => {
                                        if (err) res.send(err.message);
                                    
                                        if(affectedRows > 0){
                                            res.status(200).send('Success!');
                                        }
                                    });
                                }
                                else{
                                    res.status(401).send("User is not authorised to perform this action!");
                                }
                            }
                    
                        });
                    }
                    else{
                        res.status(401).send("User is not authorised to perform this action!");
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

export {wardrobeRouter};