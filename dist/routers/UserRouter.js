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
exports.userRouter = void 0;
const userModel = __importStar(require("../models/User"));
const express_1 = __importDefault(require("express"));
const authModel = __importStar(require("../models/Auth"));
const email_check_1 = __importDefault(require("email-check"));
const userRouter = express_1.default.Router();
exports.userRouter = userRouter;
userRouter.post('/register', (req, res) => {
    let newUser = req.body;
    authModel.verifyUsername((newUser.email), (newUser.nickname), (err, unique) => {
        if (err)
            return res.send(err.message);
        if (unique) {
            (0, email_check_1.default)(newUser.email)
                .then(function (result) {
                if (result) {
                    userModel.create(newUser, (err, insertId) => {
                        if (err) {
                            return res.status(500).json({
                                message: err.message
                            });
                        }
                        res.status(201).send("User created!");
                    });
                }
                else {
                    res.status(404).send('User email does not exists.');
                }
            })
                .catch(function (err) {
                if (err.message === 'refuse') {
                    res.status(500).send('error');
                }
                else {
                    res.status(500).send('anime waifu');
                }
            });
        }
        else {
            res.status(409).send('email or user name already taken');
        }
    });
});
userRouter.post('/login', (req, res) => {
    if (authModel.checkCredentials(req.body.uNickname, req.body.uPassword)) {
        userModel.login((req.body.uNickname), (req.body.uPassword), (err, user, uId) => {
            if (err) {
                return res.send(err.message);
            }
            if ((user != null) && (uId != null)) {
                userModel.wardList((uId), (err, result) => {
                    if (err)
                        return res.send(err.message);
                    res.status(200).send({
                        "uId": user.id,
                        "email": user.email,
                        "nickname": user.nickname,
                        "password": user.password,
                        "avatar": user.avatar,
                        "gender": user.gender,
                        "oauthToken": user.OauthToken,
                        "wardList": result
                    });
                });
            }
            else {
                res.status(404).send("User not found");
            }
        });
    }
    else {
        res.status(400).send("Data provided not sufficient!");
    }
});
userRouter.post('/getInfo', (req, res) => {
    if (authModel.checkCredentials(req.body.uNickname, req.body.uPassword)) {
        authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err, uIdRes) => {
            if (err)
                return res.send(err.message);
            if (uIdRes != null) {
                userModel.find((uIdRes), (err, user) => {
                    userModel.wardList((uIdRes), (err, result) => {
                        if (err)
                            return res.send(err.message);
                        res.status(200).send({
                            "uId": uIdRes,
                            "email": user.email,
                            "nickname": user.nickname,
                            "password": user.password,
                            "avatar": user.avatar,
                            "gender": user.gender,
                            "oauthToken": user.OauthToken,
                            "wardList": result
                        });
                    });
                });
            }
            else {
                res.status(404).send('User not found');
            }
        });
    }
    else {
        res.status(400).send("Data provided not sufficient!");
    }
});
userRouter.delete('/delUser', (req, res) => {
    if (authModel.checkCredentials(req.body.uNickname, req.body.uPassword)) {
        authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err, uIdRes) => {
            if (err)
                return res.send(err.message);
            if (uIdRes != null) {
                userModel.remove((uIdRes), (err, affectedRows) => {
                    if (err)
                        return res.send(err.message);
                    if (affectedRows > 0) {
                        res.status(200).send('Success!');
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
userRouter.put('/register/update', (req, res) => {
    if (authModel.checkCredentials(req.body.uNickname, req.body.uPassword)) {
        let updatedUser = req.body;
        updatedUser.avatar = Buffer.from(req.body.avatar, 'base64');
        authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err, uIdRes) => {
            if (err)
                return res.send(err.message);
            if (uIdRes != null) {
                userModel.update((uIdRes), (updatedUser), (err, affectedRows) => {
                    if (err)
                        return res.send(err.message);
                    if (affectedRows > 0) {
                        res.status(200).send('Success!');
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
userRouter.post('/register/addWardrobe', (req, res) => {
    if (authModel.checkCredentials(req.body.uNickname, req.body.uPassword)) {
        authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err, uIdRes) => {
            if (err) {
                return res.send(err.message);
            }
            if (uIdRes != null) {
                authModel.verifyWardrobe((uIdRes), (req.body.wId), (err, valid) => {
                    if (err) {
                        return res.send(err.message);
                    }
                    if (!valid) {
                        authModel.verifyWardrobeShared(req.body.wId, (err, valid) => {
                            if (err) {
                                return res.send(err.message);
                            }
                            if (valid) {
                                userModel.userToWardrobe((uIdRes), (req.body.wId), (err, affectedRows) => {
                                    if (err) {
                                        return res.send(err.message);
                                    }
                                    if (affectedRows > 0) {
                                        res.status(200).send('Success!');
                                    }
                                });
                            }
                            else {
                                res.status(409).send('Invalid request!');
                            }
                        });
                    }
                    else {
                        res.status(409).send("User is already registered to wardrobe!");
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
userRouter.delete('/register/delWardrobe', (req, res) => {
    if (authModel.checkCredentials(req.body.uNickname, req.body.uPassword)) {
        authModel.verifyUser((req.body.uNickname), (req.body.uPassword), (err, uIdRes) => {
            if (err)
                return res.send(err.message);
            if (uIdRes != null) {
                authModel.verifyWardrobe((uIdRes), (req.body.wId), (err, valid) => {
                    if (err)
                        return res.send(err.message);
                    if (valid) {
                        authModel.verifyWardrobeShared(req.body.wId, (err, isShared) => {
                            if (err)
                                return res.send(err.message);
                            if (!isShared)
                                return res.status(403).send("Cannot leave personal wardrobe!");
                            userModel.userDelFromWardrobe((uIdRes), (req.body.wId), (err, affectedRows) => {
                                if (err)
                                    return res.send(err.message);
                                if (affectedRows > 0)
                                    res.status(200).send('Success!');
                                else
                                    res.status(500).send('Could not leave the wardrobe');
                            });
                        });
                    }
                    else {
                        res.status(409).send("User is already not registered to wardrobe!");
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
//# sourceMappingURL=UserRouter.js.map