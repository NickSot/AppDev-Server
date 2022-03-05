"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clothDelFromWardrobe = exports.clothToWardrobe = exports.update = exports.find = exports.remove = exports.create = void 0;
const db_1 = require("../db");
const create = (cloth, callback) => {
    let queryString = `Insert Into Clothes (ClothType, Image, OriginalWardrobeId) Values (
        ?, ?, ?    )`;
    let queryString2 = 'Insert Into WardrobesClothes (wId, cId) Values (?,?    )';
    db_1.sqlClient.query(queryString, [cloth.clothType, cloth.image, cloth.originalWardrobeId], (err, result) => {
        if (err) {
            callback(err);
        }
        ;
        const insertId = result.insertId;
        db_1.sqlClient.query(queryString2, [cloth.originalWardrobeId, insertId]);
        callback(null, insertId);
    });
};
exports.create = create;
const remove = (clothId, callback) => {
    let queryString = `Delete From Clothes Where cId = ?`;
    let queryString2 = `Delete From WardrobesClothes Where cId = ?`;
    db_1.sqlClient.query(queryString, [clothId], (err, result) => {
        if (err) {
            callback(err);
        }
        ;
        const affectedRows = result.affectedRows;
        db_1.sqlClient.query(queryString2, [clothId]);
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
exports.clothToWardrobe = ((clothId, wardrobeId, callback) => {
    let queryString = 'Insert Into WardrobesClothes (cId, wId) Values (?,?    )';
    db_1.sqlClient.query(queryString, [clothId, wardrobeId], (err, result) => {
        if (err) {
            callback(err);
        }
        ;
        callback(null, result.affectedRows);
    });
});
exports.clothDelFromWardrobe = ((clothId, wardrobeId, callback) => {
    let queryString = 'Delete From WardrobesClothes Where cId = ? And wId = ?';
    db_1.sqlClient.query(queryString, [clothId, wardrobeId], (err, result) => {
        if (err) {
            callback(err);
        }
        ;
        callback(null, result.affectedRows);
    });
});
//# sourceMappingURL=Cloth.js.map