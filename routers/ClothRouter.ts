import * as clothModel from '../models/Cloth';
import {Cloth} from '../models/Cloth';
import express, {request, Request, Response} from 'express';
import * as authModel from '../models/Auth'
import fs from 'fs';

const clothRouter = express.Router();

clothRouter.post('/register', (req: Request, res: Response) => {

    if(authModel.checkCredentials(req.body.uNickname, req.body.uPassword)){

        authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
            if(err) res.send(err.message);
    
            if(uIdRes != null){
    
                let newCloth: Cloth = req.body;
    
                authModel.verifyWardrobe((uIdRes), (newCloth.originalWardrobeId), (err: Error, wValid: boolean) => {
    
                    if(wValid){
    
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
                        res.status(403).send("User is not authorised to perform this action!");
                    }
                });
            }
            else{
                res.status(401).send('Unauthorised access request!');
            }
        });
    }
    else{
        res.status(400).send("Data provided not sufficient!");
    }
});

clothRouter.delete('/:id', (req:Request, res:Response) => {

    if(authModel.checkCredentials(req.body.uNickname, req.body.uPassword)){

        authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
            if(err) res.send(err.message);
    
            if(uIdRes != null){
    
                authModel.verifyWardrobe((uIdRes), (req.body.ogWarId), (err: Error, wValid: boolean) => {
                    if(err) res.send(err.message);
    
                    if(wValid){
    
                        authModel.verifyClothOrigin((req.body.ogWarId), +(req.params.id), (err: Error, cValid: boolean)=>{
                            if(err) res.send(err.message);
    
                            if(cValid){
    
                                clothModel.remove(+(req.params.id), (err: Error, affectedRows: number) => {
                                    if (err) res.send(err.message);
                            
                                    if (affectedRows > 0) {
                                        res.status(200).send('Success!');
                                    }
                                });
                            }
                            else{
                                res.status(403).send("User is not authorised to delete this cloth!");
                            }
                        });
                    }
                    else{
                        res.status(403).send("User is not authorised to perform this action!");
                    }
                });
            }
            else{
                res.status(401).send('Unauthorised access request!');
            }
        });
    }
    else{
        res.status(400).send("Data provided not sufficient!");
    }
});

clothRouter.get('/:id', (req: Request, res: Response) => {

    if(authModel.checkCredentials(req.body.uNickname, req.body.uPassword)){

        authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
            if(err) res.send(err.message);
    
            if(uIdRes != null){
    
                authModel.verifyWardrobe((uIdRes), (req.body.wId), (err: Error, wValid: boolean) => {
                    if(err) res.send(err.message);
    
                    if(wValid){
    
                        authModel.verifyCloth((req.body.wId), +(req.params.id), (err: Error, cValid: boolean)=>{
                            if(err) res.send(err.message);
    
                            if(cValid){
    
                                clothModel.find(+(req.params.id), (err: Error, cloth: Cloth) => {
    
                                    res.status(200).send({
                                        'clothType': cloth.clothType,
                                        'image': cloth.image,
                                        'originalWardrobeId': cloth.originalWardrobeId
                                    });
                                });
                            }
                            else{
                                res.status(403).send("User is not authorised to access this cloth!");
                            }
                        });
                    }
                    else{
                        res.status(403).send("User is not authorised to perform this action!");
                    }
                });
            }
            else{
                res.status(401).send('Unauthorised access request!');
            }
        });
    }
    else{
        res.status(400).send("Data provided not sufficient!");
    }
});

clothRouter.put('/register/:id', (req:Request, res:Response) => {

    if(authModel.checkCredentials(req.body.uNickname, req.body.uPassword)){

        authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
            if(err) res.send(err.message);
    
            if(uIdRes != null){
    
                let updatedCloth: Cloth = req.body;
    
                authModel.verifyWardrobe((uIdRes), (req.body.ogWarId), (err: Error, wValid: boolean) => {
                    if(err) res.send(err.message);
    
                    if(wValid){
    
                        authModel.verifyClothOrigin((req.body.ogWarId), +(req.params.id), (err: Error, cValid: boolean)=>{
                            if(err) res.send(err.message);
    
                            if(cValid){
    
                                clothModel.update(+(req.params.id), (updatedCloth), (err: Error, affectedRows: number) => {
                                    if (err) res.send(err.message);
                            
                                    if(affectedRows > 0){
                                        res.status(200).send('Success!');
                                    }
                                });
                            }
                            else{
                                res.status(403).send("User is not authorised to delete this cloth!");
                            }
                        });
                    }
                    else{
                        res.status(403).send("User is not authorised to perform this action!");
                    }
                });
            }
            else{
                res.status(401).send('Unauthorised access request!');
            }
        });
    }
    else{
        res.status(400).send("Data provided not sufficient!");
    }
});

clothRouter.post('/register/:id', (req:Request, res:Response) => {

    if(authModel.checkCredentials(req.body.uNickname, req.body.uPassword)){

        authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
            if(err) res.send(err.message);
    
            if(uIdRes != null){
    
                authModel.verifyWardrobe((uIdRes), (req.body.ogWarId), (err: Error, wValid: boolean) => {
                    if(err) res.send(err.message);
    
                    if(wValid){
    
                        authModel.verifyClothOrigin((req.body.ogWarId), +(req.params.id), (err: Error, cValid: boolean)=>{
                            if(err) res.send(err.message);
    
                            if(cValid){
    
                                clothModel.clothToWardrobe(+(req.params.id), (req.body.wId), (err:Error, affectedRows: number) => {
                                    if (err) res.send(err.message);
                            
                                    if(affectedRows > 0){
                                        res.status(200).send('Success!');
                                    }
                                });
                            }
                            else{
                                res.status(403).send("User is not authorised to add this cloth!");
                            }
                        });
                    }
                    else{
                        res.status(403).send("User is not authorised to perform this action!");
                    }
                });
            }
            else{
                res.status(401).send('Unauthorised access request!');
            }
        });
    }
    else{
        res.status(400).send("Data provided not sufficient!");
    }
});

clothRouter.delete('/register/:id', (req:Request, res:Response) => {

    if(authModel.checkCredentials(req.body.uNickname, req.body.uPassword)){

        authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
            if(err) res.send(err.message);
    
            if(uIdRes != null){
    
                authModel.verifyWardrobe((uIdRes), (req.body.ogWarId), (err: Error, wValid: boolean) => {
                    if(err) res.send(err.message);
    
                    if(wValid){
    
                        authModel.verifyClothOrigin((req.body.ogWarId), +(req.params.id), (err: Error, cValid: boolean)=>{
                            if(err) res.send(err.message);
    
                            if(cValid){
    
                                clothModel.clothDelFromWardrobe(+(req.params.id), (req.body.wId), (err:Error, affectedRows: number) => {
                                    if (err) res.send(err.message);
                            
                                    if(affectedRows > 0){
                                        res.status(200).send('Success!');
                                    }
                                });
                            }
                            else{
                                res.status(403).send("User is not authorised to delete this cloth!");
                            }
                        });
                    }
                    else{
                        res.status(403).send("User is not authorised to perform this action!");
                    }
                });
            }
            else{
                res.status(401).send('Unauthorised access request!');
            }
        });
    }
    else{
        res.status(400).send("Data provided not sufficient!");
    }
});

export {clothRouter};