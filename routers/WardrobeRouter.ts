import * as wardrobeModel from '../models/Wardrobe';
import {Wardrobe} from '../models/Wardrobe';
import express, {request, Request, Response} from 'express';
import fs from 'fs';

const wardrobeRouter = express.Router();

wardrobeRouter.post('/register', (req: Request, res: Response) => {
    let newWardrobe: Wardrobe = req.body;

    wardrobeModel.create(newWardrobe, (err: Error, insertId: number) => {
        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        res.status(200).json({
            message: 'Success!',
            wId: insertId
        });
    });
});

wardrobeRouter.delete('/:id', (req:Request, res:Response) => {
    wardrobeModel.remove(+(req.params.id), (err: Error, affectedRows: number) => {
        if (err) res.send(err.message);

        if (affectedRows > 0) {
            res.status(200).send('Success!');
        }
    });
});

wardrobeRouter.get('/:id', (req: Request, res: Response) => {
    wardrobeModel.find(+(req.params.id), (err: Error, wardrobe: Wardrobe) => {

        res.status(200).send({
            'nickname': wardrobe.nickname,
            'creationTime': wardrobe.creationTime,
            'wardrobeType': wardrobe.wardrobeType
        });
    });
});

wardrobeRouter.put('/register/:id', (req:Request, res:Response) => {
    let updatedUser: Wardrobe = req.body;

    wardrobeModel.update(+(req.params.id), (updatedUser), (err: Error, affectedRows: number) => {
        if (err) res.send(err.message);

        if(affectedRows > 0){
            res.status(200).send('Success!');
        }
    });
});

export {wardrobeRouter};