"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clothList = exports.update = exports.find = exports.remove = exports.create = void 0;
const db_1 = require("../db");
const create = (wardrobe, callback) => {
    let queryString = `Insert Into Wardrobes (NickName, CreationTime, WardrobeType, AdminId) Values (
        ?, ?, ?, ?)`;
    let queryString2 = 'Insert Into UsersWardrobes (uId, wId) Values (?,?)';
    db_1.sqlClient.query(queryString, [wardrobe.nickname, wardrobe.creationTime, wardrobe.wardrobeType, wardrobe.adminId], (err, result) => {
        if (err) {
            return callback(err);
        }
        ;
        const insertId = result.insertId;
        db_1.sqlClient.query(queryString2, [wardrobe.uId, insertId]);
        callback(null, insertId);
    });
};
exports.create = create;
const remove = (wardrobeId, callback) => {
    let queryString = `Delete From Wardrobes Where wId = ?`;
    let queryString2 = `Delete From UsersWardrobes Where wId = ?`;
    db_1.sqlClient.query(queryString, [wardrobeId], (err, result) => {
        if (err) {
            callback(err);
        }
        ;
        const affectedRows = result.affectedRows;
        db_1.sqlClient.query(queryString2, [wardrobeId]);
        callback(null, affectedRows);
    });
};
exports.remove = remove;
const find = (wardrobeId, callback) => {
    let queryString = `Select * From Wardrobes Where wId = ?`;
    db_1.sqlClient.query(queryString, [wardrobeId], (err, result) => {
        if (err) {
            callback(err);
        }
        ;
        const row = result[0];
        const wardrobe = {
            uId: -1,
            nickname: row.NickName,
            creationTime: row.CreationTime,
            wardrobeType: row.WardrobeType,
            adminId: row.AdminId
        };
        callback(null, wardrobe);
    });
};
exports.find = find;
const update = (wardrobeId, updateValues, callback) => {
    let queryString = `Update Wardrobes Set NickName = ?, CreationTime = ?, WardrobeType = ?, AdminId = ? Where wId = ?`;
    db_1.sqlClient.query(queryString, [updateValues.nickname, updateValues.creationTime,
        updateValues.wardrobeType, updateValues.adminId, wardrobeId], (err, result) => {
        if (err) {
            callback(err);
        }
        ;
        callback(null, result.affectedRows);
    });
};
exports.update = update;
exports.clothList = ((wardrobeId, callback) => {
    let queryString = 'Select c.cId, c.ClothType, c.Image, c.OriginalWardrobeId From Wardrobes w Inner Join WardrobesClothes wc On w.wId = wc.wId Inner Join Clothes c On c.cId = wc.cId Where w.wId = ?';
    db_1.sqlClient.query(queryString, [wardrobeId], (err, result) => {
        if (err) {
            callback(err);
        }
        callback(null, result);
    });
});
//# sourceMappingURL=Wardrobe.js.map