"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
const fs_1 = __importDefault(require("fs"));
const clothRouter = express_1.default.Router();
exports.clothRouter = clothRouter;
clothRouter.post('/register', (req, res) => {
    if (authModel.checkCredentials(req.body.uNickname, req.body.uPassword)) {
        authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err, uIdRes) => {
            if (err)
                return res.send(err.message);
            if (uIdRes != null) {
                let newCloth = req.body;
                var image = newCloth.image;
                newCloth.image = "image";
                newCloth.originalUserId = uIdRes;
                authModel.verifyWardrobe((uIdRes), (newCloth.originalWardrobeId), (err, wValid) => {
                    if (wValid) {
                        clothModel.create(newCloth, (err, insertId) => {
                            if (err) {
                                return res.status(500).json({
                                    message: err.message
                                });
                            }
                            var path = "pictures/" + insertId + ".png";
                            //var base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");
                            var base64Data = Buffer.from(image, 'base64');
                            fs_1.default.writeFile(path, base64Data, function (err) {
                                if (err)
                                    return res.send(err.message);
                                newCloth.image = path;
                                clothModel.update((insertId), (newCloth), (err, affectedRows) => {
                                    if (err)
                                        return res.send(err.message);
                                    if (affectedRows > 0) {
                                        res.status(201).json({
                                            message: 'Cloth created!'
                                        });
                                    }
                                });
                            });
                        });
                    }
                    else {
                        res.status(401).send("User is not authorised to perform this action!");
                    }
                });
            }
            else {
                res.status(403).send('Unauthorised access request!');
            }
        });
    }
    else {
        res.status(400).send("Data provided not sufficient!");
    }
});
clothRouter.delete('/:id', (req, res) => {
    if (authModel.checkCredentials(req.body.uNickname, req.body.uPassword)) {
        authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err, uIdRes) => {
            if (err)
                return res.send(err.message);
            if (uIdRes != null) {
                authModel.verifyWardrobe((uIdRes), (req.body.ogWarId), (err, wValid) => {
                    if (err)
                        return res.send(err.message);
                    if (wValid) {
                        authModel.verifyClothOrigin((uIdRes), +(req.params.id), (err, cValid) => {
                            if (err)
                                return res.send(err.message);
                            if (cValid) {
                                clothModel.remove(+(req.params.id), (err, affectedRows) => {
                                    if (err)
                                        res.send(err.message);
                                    var path = "pictures/" + req.params.id + ".png";
                                    fs_1.default.unlink(path, (err) => {
                                        if (err)
                                            return res.send(err.message);
                                        if (affectedRows > 0) {
                                            res.status(200).send('Success!');
                                        }
                                    });
                                });
                            }
                            else {
                                res.status(401).send("User is not authorised to delete this cloth!");
                            }
                        });
                    }
                    else {
                        res.status(401).send("User is not authorised to perform this action!");
                    }
                });
            }
            else {
                res.status(403).send('Unauthorised access request!');
            }
        });
    }
    else {
        res.status(400).send("Data provided not sufficient!");
    }
});
clothRouter.post('/:id', (req, res) => {
    if (authModel.checkCredentials(req.body.uNickname, req.body.uPassword)) {
        authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err, uIdRes) => {
            if (err)
                return res.send(err.message);
            if (uIdRes != null) {
                authModel.verifyWardrobe((uIdRes), (req.body.wId), (err, wValid) => {
                    if (err)
                        return res.send(err.message);
                    if (wValid) {
                        authModel.verifyCloth((req.body.wId), +(req.params.id), (err, cValid) => {
                            if (err)
                                return res.send(err.message);
                            if (cValid) {
                                clothModel.find(+(req.params.id), (err, cloth) => {
                                    var path = "pictures/" + req.params.id + ".png";
                                    var imageAsBase64 = fs_1.default.readFileSync(path, 'base64');
                                    res.status(200).send({
                                        'clothType': cloth.clothType,
                                        'image': imageAsBase64,
                                        'originalWardrobeId': cloth.originalWardrobeId,
                                        'originalUser': cloth.originalUserName
                                    });
                                });
                            }
                            else {
                                res.status(401).send("User is not authorised to access this cloth!");
                            }
                        });
                    }
                    else {
                        res.status(401).send("User is not authorised to perform this action!");
                    }
                });
            }
            else {
                res.status(403).send('Unauthorised access request!');
            }
        });
    }
    else {
        res.status(400).send("Data provided not sufficient!");
    }
});
clothRouter.put('/register/:id', (req, res) => {
    if (authModel.checkCredentials(req.body.uNickname, req.body.uPassword)) {
        authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err, uIdRes) => {
            if (err)
                return res.send(err.message);
            if (uIdRes != null) {
                let updatedCloth = req.body;
                var image = updatedCloth.image;
                updatedCloth.image = "image";
                authModel.verifyWardrobe((uIdRes), (req.body.ogWarId), (err, wValid) => {
                    if (err)
                        return res.send(err.message);
                    if (wValid) {
                        authModel.verifyClothOrigin((uIdRes), +(req.params.id), (err, cValid) => {
                            if (err)
                                return res.send(err.message);
                            if (cValid) {
                                var path = "pictures/" + req.params.id + ".png";
                                var base64Data = Buffer.from(image, 'base64');
                                fs_1.default.writeFile(path, base64Data, function (err) {
                                    if (err)
                                        return res.send(err.message);
                                    updatedCloth.image = path;
                                    clothModel.update(+(req.params.id), (updatedCloth), (err, affectedRows) => {
                                        if (err)
                                            return res.send(err.message);
                                        if (affectedRows > 0) {
                                            res.status(200).send('Success!');
                                        }
                                    });
                                });
                            }
                            else {
                                res.status(401).send("User is not authorised to delete this cloth!");
                            }
                        });
                    }
                    else {
                        res.status(401).send("User is not authorised to perform this action!");
                    }
                });
            }
            else {
                res.status(403).send('Unauthorised access request!');
            }
        });
    }
    else {
        res.status(400).send("Data provided not sufficient!");
    }
});
clothRouter.post('/register/:id', (req, res) => {
    if (authModel.checkCredentials(req.body.uNickname, req.body.uPassword)) {
        authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err, uIdRes) => {
            if (err)
                return res.send(err.message);
            if (uIdRes != null) {
                authModel.verifyWardrobe((uIdRes), (req.body.ogWarId), (err, wValid) => {
                    if (err)
                        return res.send(err.message);
                    if (wValid) {
                        authModel.verifyClothOrigin((uIdRes), +(req.params.id), (err, cOgValid) => {
                            if (err)
                                return res.send(err.message);
                            if (cOgValid) {
                                authModel.verifyCloth((req.body.wId), +(req.params.id), (err, cValid) => {
                                    if (err)
                                        return res.send(err.message);
                                    if (!cValid) {
                                        clothModel.clothToWardrobe(+(req.params.id), (req.body.wId), (err, affectedRows) => {
                                            if (err)
                                                return res.send(err.message);
                                            if (affectedRows > 0) {
                                                res.status(200).send('Success!');
                                            }
                                        });
                                    }
                                    else {
                                        res.status(409).send("Cloth already has relation!");
                                    }
                                });
                            }
                            else {
                                res.status(401).send("User is not authorised to add this cloth!");
                            }
                        });
                    }
                    else {
                        res.status(401).send("User is not authorised to perform this action!");
                    }
                });
            }
            else {
                res.status(403).send('Unauthorised access request!');
            }
        });
    }
    else {
        res.status(400).send("Data provided not sufficient!");
    }
});
clothRouter.delete('/register/:id', (req, res) => {
    if (authModel.checkCredentials(req.body.uNickname, req.body.uPassword)) {
        authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err, uIdRes) => {
            if (err)
                return res.send(err.message);
            if (uIdRes != null) {
                authModel.verifyWardrobe((uIdRes), (req.body.ogWarId), (err, wValid) => {
                    if (err)
                        return res.send(err.message);
                    if (wValid) {
                        authModel.verifyClothOrigin((uIdRes), +(req.params.id), (err, cOgValid) => {
                            if (err)
                                return res.send(err.message);
                            if (cOgValid) {
                                authModel.verifyCloth((req.body.wId), +(req.params.id), (err, cValid) => {
                                    if (err)
                                        return res.send(err.message);
                                    if (cValid) {
                                        clothModel.clothDelFromWardrobe(+(req.params.id), (req.body.wId), (err, affectedRows) => {
                                            if (err)
                                                return res.send(err.message);
                                            if (affectedRows > 0) {
                                                res.status(200).send('Success!');
                                            }
                                        });
                                    }
                                    else {
                                        res.status(409).send("Cloth already does not have any relation!");
                                    }
                                });
                            }
                            else {
                                res.status(401).send("User is not authorised to delete this cloth!");
                            }
                        });
                    }
                    else {
                        res.status(401).send("User is not authorised to perform this action!");
                    }
                });
            }
            else {
                res.status(403).send('Unauthorised access request!');
            }
        });
    }
    else {
        res.status(400).send("Data provided not sufficient!");
    }
});
//# sourceMappingURL=ClothRouter.js.map