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
exports.wardrobeRouter = void 0;
const wardrobeModel = __importStar(require("../models/Wardrobe"));
const express_1 = __importDefault(require("express"));
const authModel = __importStar(require("../models/Auth"));
const wardrobeRouter = express_1.default.Router();
exports.wardrobeRouter = wardrobeRouter;
wardrobeRouter.post('/register', (req, res) => {
    authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err, uIdRes) => {
        if (err)
            res.send(err.message);
        if (uIdRes != null) {
            let newWardrobe = req.body;
            newWardrobe.uId = uIdRes;
            wardrobeModel.create(newWardrobe, (err, insertId) => {
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
        else {
            res.status(401).send('Unauthorised access request!');
        }
    });
});
wardrobeRouter.delete('/:id', (req, res) => {
    authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err, uIdRes) => {
        if (err)
            res.send(err.message);
        if (uIdRes != null) {
            wardrobeModel.remove(+(req.params.id), (err, affectedRows) => {
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
wardrobeRouter.get('/:id', (req, res) => {
    authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err, uIdRes) => {
        if (err)
            res.send(err.message);
        if (uIdRes != null) {
            wardrobeModel.find(+(req.params.id), (err, wardrobe) => {
                wardrobeModel.clothList(+(req.params.id), (err, result) => {
                    if (err)
                        res.send(err.message);
                    res.status(200).send({
                        'nickname': wardrobe.nickname,
                        'creationTime': wardrobe.creationTime,
                        'wardrobeType': wardrobe.wardrobeType,
                        'clothList': result
                    });
                });
            });
        }
        else {
            res.status(401).send('Unauthorised access request!');
        }
    });
});
wardrobeRouter.put('/register/:id', (req, res) => {
    authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err, uIdRes) => {
        if (err)
            res.send(err.message);
        if (uIdRes != null) {
            let updatedWardrobe = req.body;
            updatedWardrobe.uId = uIdRes;
            wardrobeModel.update(+(req.params.id), (updatedWardrobe), (err, affectedRows) => {
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
//# sourceMappingURL=WardrobeRouter.js.map