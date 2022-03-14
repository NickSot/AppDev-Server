import * as clothModel from '../models/Cloth';
import {Cloth} from '../models/Cloth';
import express, {request, Request, Response} from 'express';
import * as authModel from '../models/Auth'
import fs from 'fs';

const clothRouter = express.Router();

clothRouter.post('/register', (req: Request, res: Response) => {

    authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
        if(err) res.send(err.message);

        if(uIdRes != null){

            let newCloth: Cloth = req.body;

            clothModel.create(newCloth, (err: Error, insertId: number) => {
                if (err) {
                    return res.status(500).json({
                        message: err.message
                    });
                }
        
                res.status(201).json({
                    message: 'Cloth created!',
                    cId: insertId
                });
            });
        }
        else{
            res.status(401).send('Unauthorised access request!');
        }
    });
});

clothRouter.delete('/:id', (req:Request, res:Response) => {

    authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
        if(err) res.send(err.message);

        if(uIdRes != null){

            clothModel.remove(+(req.params.id), (err: Error, affectedRows: number) => {
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

clothRouter.get('/:id', (req: Request, res: Response) => {

    authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
        if(err) res.send(err.message);

        if(uIdRes != null){

            clothModel.find(+(req.params.id), (err: Error, cloth: Cloth) => {

                res.status(200).send({
                    'clothType': cloth.clothType,
                    'image': cloth.image,
                    'originalWardrobeId': cloth.originalWardrobeId
                });
            });
        }
        else{
            res.status(401).send('Unauthorised access request!');
        }
    });
});

clothRouter.put('/register/:id', (req:Request, res:Response) => {

    authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
        if(err) res.send(err.message);

        if(uIdRes != null){

            let updatedCloth: Cloth = req.body;

            clothModel.update(+(req.params.id), (updatedCloth), (err: Error, affectedRows: number) => {
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

clothRouter.post('/register/:id', (req:Request, res:Response) => {

    authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
        if(err) res.send(err.message);

        if(uIdRes != null){

            clothModel.clothToWardrobe(+(req.params.id), (req.body.wId), (err:Error, affectedRows: number) => {
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

clothRouter.delete('/register/:id', (req:Request, res:Response) => {

    authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
        if(err) res.send(err.message);

        if(uIdRes != null){

            clothModel.clothDelFromWardrobe(+(req.params.id), (req.body.wId), (err:Error, affectedRows: number) => {
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

export {clothRouter};