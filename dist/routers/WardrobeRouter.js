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
const wardrobeRouter = express_1.default.Router();
exports.wardrobeRouter = wardrobeRouter;
wardrobeRouter.post('/register', (req, res) => {
    let newWardrobe = req.body;
    wardrobeModel.create(newWardrobe, (err, insertId) => {
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
wardrobeRouter.delete('/:id', (req, res) => {
    wardrobeModel.remove(+(req.params.id), (err, affectedRows) => {
        if (err)
            res.send(err.message);
        if (affectedRows > 0) {
            res.status(200).send('Success!');
        }
    });
});
wardrobeRouter.get('/:id', (req, res) => {
    wardrobeModel.find(+(req.params.id), (err, wardrobe) => {
        res.status(200).send({
            'nickname': wardrobe.nickname,
            'creationTime': wardrobe.creationTime,
            'wardrobeType': wardrobe.wardrobeType
        });
    });
});
wardrobeRouter.put('/register/:id', (req, res) => {
    let updatedUser = req.body;
    wardrobeModel.update(+(req.params.id), (updatedUser), (err, affectedRows) => {
        if (err)
            res.send(err.message);
        if (affectedRows > 0) {
            res.status(200).send('Success!');
        }
    });
});
//# sourceMappingURL=WardrobeRouter.js.map