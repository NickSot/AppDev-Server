import * as clothModel from '../models/Cloth';
import {Cloth} from '../models/Cloth';
import express, {request, Request, Response} from 'express';
import fs from 'fs';

const clothRouter = express.Router();

clothRouter.post('/register', (req: Request, res: Response) => {
    let newCloth: Cloth = req.body;

    clothModel.create(newCloth, (err: Error, insertId: number) => {
        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        res.status(200).json({
            message: 'Success!',
            cId: insertId
        });
    });
});

clothRouter.delete('/:id', (req:Request, res:Response) => {
    clothModel.remove(+(req.params.id), (err: Error, affectedRows: number) => {
        if (err) res.send(err.message);

        if (affectedRows > 0) {
            res.status(200).send('Success!');
        }
    });
});

clothRouter.get('/:id', (req: Request, res: Response) => {
    clothModel.find(+(req.params.id), (err: Error, cloth: Cloth) => {

        res.status(200).send({
            'clothType': cloth.clothType,
            'image': cloth.image,
            'originalWardrobeId': cloth.originalWardrobeId
        });
    });
});

clothRouter.put('/register/:id', (req:Request, res:Response) => {
    let updatedUser: Cloth = req.body;

    clothModel.update(+(req.params.id), (updatedUser), (err: Error, affectedRows: number) => {
        if (err) res.send(err.message);

        if(affectedRows > 0){
            res.status(200).send('Success!');
        }
    });
});

export {clothRouter};