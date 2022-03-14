import * as wardrobeModel from '../models/Wardrobe';
import {Wardrobe} from '../models/Wardrobe';
import express, {request, Request, Response} from 'express';
import * as authModel from '../models/Auth'
import fs from 'fs';

const wardrobeRouter = express.Router();

wardrobeRouter.post('/register', (req: Request, res: Response) => {

    authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
        if(err) res.send(err.message);

        if(uIdRes != null){

            let newWardrobe: Wardrobe = req.body;

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
            res.status(401).send('Unauthorised access request!');
        }
    });
});

wardrobeRouter.delete('/:id', (req:Request, res:Response) => {

    authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
        if(err) res.send(err.message);

        if(uIdRes != null){

            wardrobeModel.remove(+(req.params.id), (err: Error, affectedRows: number) => {
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

wardrobeRouter.get('/:id', (req: Request, res: Response) => {

    authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
        if(err) res.send(err.message);

        if(uIdRes != null){

            wardrobeModel.find(+(req.params.id), (err: Error, wardrobe: Wardrobe) => {

                wardrobeModel.clothList(+(req.params.id), (err: Error, result: Array<number>) =>{
        
                    res.status(200).send({
                        'nickname': wardrobe.nickname,
                        'creationTime': wardrobe.creationTime,
                        'wardrobeType': wardrobe.wardrobeType,
                        'clothList': result
                    });
                });
            });
        }
        else{
            res.status(401).send('Unauthorised access request!');
        }
    });
});

wardrobeRouter.put('/register/:id', (req:Request, res:Response) => {

    authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
        if(err) res.send(err.message);

        if(uIdRes != null){

            let updatedWardrobe: Wardrobe = req.body;

            wardrobeModel.update(+(req.params.id), (updatedWardrobe), (err: Error, affectedRows: number) => {
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

export {wardrobeRouter};