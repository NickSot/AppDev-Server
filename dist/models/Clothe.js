"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const db_1 = require("../db");
const create = (wardrobe, callback) => {
    let queryString = `Insert Into Wardrobes (NickName, CreationTime, WardrobeType) Values (
        ?, ?, ?    )`;
    db_1.sqlClient.query(queryString, [wardrobe.nickname, wardrobe.creationTime, wardrobe.wardrobeType], (err, result) => {
        if (err) {
            callback(err);
        }
        ;
        const insertId = result.insertId;
        callback(null, insertId);
    });
};
exports.create = create;
//# sourceMappingURL=Clothe.js.map