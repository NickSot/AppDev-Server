import * as clothModel from '../models/Cloth';
import {Cloth} from '../models/Cloth';
import express, {request, Request, Response} from 'express';
import * as authModel from '../models/Auth'
import fs from 'fs';
import { setOriginalNode } from 'typescript';

const clothRouter = express.Router();

clothRouter.post('/register', (req: Request, res: Response) => {

    if(authModel.checkCredentials(req.body.uNickname, req.body.uPassword)){

        authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
            if(err) return res.send(err.message);
    
            if(uIdRes != null){
    
                let newCloth: Cloth = req.body;
                var image = newCloth.image;
                newCloth.image = "image";
    
                authModel.verifyWardrobe((uIdRes), (newCloth.originalWardrobeId), (err: Error, wValid: boolean) => {
    
                    if(wValid){
    
                        clothModel.create(newCloth, (err: Error, insertId: number) => {
                            if (err) {
                                return res.status(500).json({
                                    message: err.message
                                });
                            }

                            var path = "pictures/" + insertId +".png";

                            //var base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");

                            var base64Data = Buffer.from(image, 'base64');

                            fs.writeFile(path, base64Data, function(err) {
                                if(err) return res.send(err.message);

                                newCloth.image = path;

                                clothModel.update((insertId), (newCloth), (err: Error, affectedRows: number) => {
                                    if (err) return res.send(err.message);
                            
                                    if(affectedRows > 0){
                                        res.status(201).json({
                                            message: 'Cloth created!'
                                        });
                                    }
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

clothRouter.delete('/:id', (req:Request, res:Response) => {

    if(authModel.checkCredentials(req.body.uNickname, req.body.uPassword)){

        authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
            if(err) return res.send(err.message);
    
            if(uIdRes != null){
    
                authModel.verifyWardrobe((uIdRes), (req.body.ogWarId), (err: Error, wValid: boolean) => {
                    if(err) return res.send(err.message);
    
                    if(wValid){
    
                        authModel.verifyClothOrigin((req.body.ogWarId), +(req.params.id), (err: Error, cValid: boolean)=>{
                            if(err) return res.send(err.message);
    
                            if(cValid){
    
                                clothModel.remove(+(req.params.id), (err: Error, affectedRows: number) => {
                                    if (err) res.send(err.message);

                                    var path = "pictures/" + req.params.id + ".png";

                                    fs.unlink(path, (err) => {
                                        if(err) return res.send(err.message);

                                        if (affectedRows > 0) {
                                            res.status(200).send('Success!');
                                        }
                                      })
                                });
                            }
                            else{
                                res.status(401).send("User is not authorised to delete this cloth!");
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

clothRouter.post('/:id', (req: Request, res: Response) => {

    if(authModel.checkCredentials(req.body.uNickname, req.body.uPassword)){

        authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
            if(err) return res.send(err.message);
    
            if(uIdRes != null){
    
                authModel.verifyWardrobe((uIdRes), (req.body.wId), (err: Error, wValid: boolean) => {
                    if(err) return res.send(err.message);
    
                    if(wValid){
    
                        authModel.verifyCloth((req.body.wId), +(req.params.id), (err: Error, cValid: boolean)=>{
                            if(err) return res.send(err.message);
    
                            if(cValid){
    
                                clothModel.find(+(req.params.id), (err: Error, cloth: Cloth) => {

                                    var path = "pictures/" + req.params.id + ".png";

                                    var imageAsBase64 = fs.readFileSync(path, 'base64');
    
                                    res.status(200).send({
                                        'clothType': cloth.clothType,
                                        'image': imageAsBase64,
                                        'originalWardrobeId': cloth.originalWardrobeId
                                    });
                                });
                            }
                            else{
                                res.status(401).send("User is not authorised to access this cloth!");
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

clothRouter.put('/register/:id', (req:Request, res:Response) => {

    if(authModel.checkCredentials(req.body.uNickname, req.body.uPassword)){

        authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
            if(err) return res.send(err.message);
    
            if(uIdRes != null){
    
                let updatedCloth: Cloth = req.body;
                var image = updatedCloth.image;
                updatedCloth.image = "image";
    
                authModel.verifyWardrobe((uIdRes), (req.body.ogWarId), (err: Error, wValid: boolean) => {
                    if(err) return res.send(err.message);
    
                    if(wValid){
    
                        authModel.verifyClothOrigin((req.body.ogWarId), +(req.params.id), (err: Error, cValid: boolean)=>{
                            if(err) return res.send(err.message);
    
                            if(cValid){

                                var path = "pictures/" + req.params.id + ".png";

                                var base64Data = Buffer.from(image, 'base64');

                                fs.writeFile(path, base64Data, function(err) {
                                    if(err) return res.send(err.message);

                                    updatedCloth.image = path;
                                    
                                    clothModel.update(+(req.params.id), (updatedCloth), (err: Error, affectedRows: number) => {
                                        if (err) return res.send(err.message);
                                
                                        if(affectedRows > 0){
                                            res.status(200).send('Success!');
                                        }
                                    });
                                });
                            }
                            else{
                                res.status(401).send("User is not authorised to delete this cloth!");
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

clothRouter.post('/register/:id', (req:Request, res:Response) => {

    if(authModel.checkCredentials(req.body.uNickname, req.body.uPassword)){

        authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
            if(err) return res.send(err.message);
    
            if(uIdRes != null){
    
                authModel.verifyWardrobe((uIdRes), (req.body.ogWarId), (err: Error, wValid: boolean) => {
                    if(err) return res.send(err.message);
    
                    if(wValid){
    
                        authModel.verifyClothOrigin((req.body.ogWarId), +(req.params.id), (err: Error, cOgValid: boolean)=>{
                            if(err) return res.send(err.message);
    
                            if(cOgValid){

                                authModel.verifyCloth((req.body.wId), +(req.params.id), (err: Error, cValid: boolean)=>{
                                    if(err) return res.send(err.message);
            
                                    if(!cValid){

                                        clothModel.clothToWardrobe(+(req.params.id), (req.body.wId), (err:Error, affectedRows: number) => {
                                            if (err) return res.send(err.message);
                                    
                                            if(affectedRows > 0){
                                                res.status(200).send('Success!');
                                            }
                                        });
                                    }
                                    else{
                                        res.status(409).send("Cloth already has relation!");
                                    }
                                });
                            }
                            else{
                                res.status(401).send("User is not authorised to add this cloth!");
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

clothRouter.delete('/register/:id', (req:Request, res:Response) => {

    if(authModel.checkCredentials(req.body.uNickname, req.body.uPassword)){

        authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err: Error, uIdRes?: number) => {
            if(err) return res.send(err.message);
    
            if(uIdRes != null){
    
                authModel.verifyWardrobe((uIdRes), (req.body.ogWarId), (err: Error, wValid: boolean) => {
                    if(err) return res.send(err.message);
    
                    if(wValid){
    
                        authModel.verifyClothOrigin((req.body.ogWarId), +(req.params.id), (err: Error, cOgValid: boolean)=>{
                            if(err) return res.send(err.message);
    
                            if(cOgValid){

                                authModel.verifyCloth((req.body.wId), +(req.params.id), (err: Error, cValid: boolean)=>{
                                    if(err) return res.send(err.message);
            
                                    if(cValid){

                                        clothModel.clothDelFromWardrobe(+(req.params.id), (req.body.wId), (err:Error, affectedRows: number) => {
                                            if (err) return res.send(err.message);
                                    
                                            if(affectedRows > 0){
                                                res.status(200).send('Success!');
                                            }
                                        });
                                    }
                                    else{
                                        res.status(409).send("Cloth already does not have any relation!");
                                    }
                                });
                            }
                            else{
                                res.status(401).send("User is not authorised to delete this cloth!");
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

export {clothRouter};