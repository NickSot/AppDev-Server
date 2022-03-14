"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clothRouter = void 0;
const clothModel = __importStar(require("../models/Cloth"));
const express_1 = __importDefault(require("express"));
const authModel = __importStar(require("../models/Auth"));
const clothRouter = express_1.default.Router();
exports.clothRouter = clothRouter;
clothRouter.post('/register', (req, res) => {
    authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err, uIdRes) => {
        if (err)
            res.send(err.message);
        if (uIdRes != null) {
            let newCloth = req.body;
            clothModel.create(newCloth, (err, insertId) => {
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
        else {
            res.status(401).send('Unauthorised access request!');
        }
    });
});
clothRouter.delete('/:id', (req, res) => {
    authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err, uIdRes) => {
        if (err)
            res.send(err.message);
        if (uIdRes != null) {
            clothModel.remove(+(req.params.id), (err, affectedRows) => {
                if (err)
                    res.send(err.message);
                if (affectedRows > 0) {
                    res.status(200).send('Success!');
                }
            });
        }
        else {
            res.status(401).send('Unauthorised access request!');
        }
    });
});
clothRouter.get('/:id', (req, res) => {
    authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err, uIdRes) => {
        if (err)
            res.send(err.message);
        if (uIdRes != null) {
            clothModel.find(+(req.params.id), (err, cloth) => {
                res.status(200).send({
                    'clothType': cloth.clothType,
                    'image': cloth.image,
                    'originalWardrobeId': cloth.originalWardrobeId
                });
            });
        }
        else {
            res.status(401).send('Unauthorised access request!');
        }
    });
});
clothRouter.put('/register/:id', (req, res) => {
    authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err, uIdRes) => {
        if (err)
            res.send(err.message);
        if (uIdRes != null) {
            let updatedCloth = req.body;
            clothModel.update(+(req.params.id), (updatedCloth), (err, affectedRows) => {
                if (err)
                    res.send(err.message);
                if (affectedRows > 0) {
                    res.status(200).send('Success!');
                }
            });
        }
        else {
            res.status(401).send('Unauthorised access request!');
        }
    });
});
clothRouter.post('/register/:id', (req, res) => {
    authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err, uIdRes) => {
        if (err)
            res.send(err.message);
        if (uIdRes != null) {
            clothModel.clothToWardrobe(+(req.params.id), (req.body.wId), (err, affectedRows) => {
                if (err)
                    res.send(err.message);
                if (affectedRows > 0) {
                    res.status(200).send('Success!');
                }
            });
        }
        else {
            res.status(401).send('Unauthorised access request!');
        }
    });
});
clothRouter.delete('/register/:id', (req, res) => {
    authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err, uIdRes) => {
        if (err)
            res.send(err.message);
        if (uIdRes != null) {
            clothModel.clothDelFromWardrobe(+(req.params.id), (req.body.wId), (err, affectedRows) => {
                if (err)
                    res.send(err.message);
                if (affectedRows > 0) {
                    res.status(200).send('Success!');
                }
            });
        }
        else {
            res.status(401).send('Unauthorised access request!');
        }
    });
});
//# sourceMappingURL=ClothRouter.js.map