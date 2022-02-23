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
exports.userRouter = void 0;
const userModel = __importStar(require("../models/User"));
const express_1 = __importDefault(require("express"));
const userRouter = express_1.default.Router();
exports.userRouter = userRouter;
userRouter.post('/register', (req, res) => {
    let newUser = req.body;
    newUser.avatar = Buffer.from(req.body.avatar, 'base64');
    userModel.create(newUser, (err, uId) => {
        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }
        res.status(200).json({
            message: 'Success!'
        });
    });
});
userRouter.get('/:id', (req, res) => {
    userModel.find(+(req.params.id), (err, user) => {
        res.status(200).send(`Email: ${user.email} and Gender: ${user.gender}`);
    });
});
userRouter.delete('/:id', (req, res) => {
    userModel.remove(+(req.params.id), (err, affectedRows) => {
        if (err)
            res.send(err.message);
        if (affectedRows > 0) {
            res.status(200).send('Success!');
        }
    });
});
//# sourceMappingURL=UserRouter.js.map