"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.find = exports.remove = exports.create = void 0;
const db_1 = require("../db");
const create = (cloth, callback) => {
    let queryString = `Insert Into Clothes (ClothType, Image, OriginalWardrobeId) Values (
        ?, ?, ?    )`;
    db_1.sqlClient.query(queryString, [cloth.clothType, cloth.image, cloth.originalWardrobeId], (err, result) => {
        if (err) {
            callback(err);
        }
        ;
        const insertId = result.insertId;
        callback(null, insertId);
    });
};
exports.create = create;
const remove = (clothId, callback) => {
    let queryString = `Delete From Clothes Where cId = ?`;
    db_1.sqlClient.query(queryString, [clothId], (err, result) => {
        if (err) {
            callback(err);
        }
        ;
        const affectedRows = result.affectedRows;
        callback(null, affectedRows);
    });
};
exports.remove = remove;
const find = (clothId, callback) => {
    let queryString = `Select * From Clothes Where cId = ?`;
    db_1.sqlClient.query(queryString, [clothId], (err, result) => {
        if (err) {
            callback(err);
        }
        ;
        const row = result[0];
        const cloth = {
            clothType: row.ClothType,
            image: row.Image,
            originalWardrobeId: row.OriginalWardrobeId
        };
        callback(null, cloth);
    });
};
exports.find = find;
const update = (clothId, updateValues, callback) => {
    let queryString = `Update Clothes Set ClothType = ?, Image = ?, OriginalWardrobeId = ? Where cId = ?`;
    db_1.sqlClient.query(queryString, [updateValues.clothType, updateValues.image,
        updateValues.originalWardrobeId, clothId], (err, result) => {
        if (err) {
            callback(err);
        }
        ;
        callback(null, result.affectedRows);
    });
};
exports.update = update;
//# sourceMappingURL=Cloth.js.map