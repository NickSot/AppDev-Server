"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCredentials = exports.verifyCloth = exports.verifyClothOrigin = exports.verifyWardrobe = exports.verifyUser = void 0;
const db_1 = require("../db");
exports.verifyUser = ((nickname, password, callback) => {
    let queryString = 'Select uId From Users Where NickName = ? And Pass = ?';
    db_1.sqlClient.query(queryString, [nickname, password], (err, result) => {
        if (err) {
            callback(err);
        }
        ;
        let uIdRes = null;
        if (result.length > 0) {
            uIdRes = result[0].uId;
            callback(null, uIdRes);
        }
        else {
            callback(null, null);
        }
    });
});
exports.verifyWardrobe = ((uId, wId, callback) => {
    let queryString = 'Select * From UsersWardrobes Where uId = ? And wId = ?';
    db_1.sqlClient.query(queryString, [uId, wId], (err, result) => {
        if (err) {
            callback(err);
        }
        ;
        if (result.length > 0) {
            callback(null, true);
        }
        else {
            callback(null, false);
        }
    });
});
exports.verifyClothOrigin = ((wId, cId, callback) => {
    let queryString = 'Select * From Clothes Where OriginalWardrobeId = ? And cId = ?';
    db_1.sqlClient.query(queryString, [wId, cId], (err, result) => {
        if (err) {
            callback(err);
        }
        ;
        if (result.length > 0) {
            callback(null, true);
        }
        else {
            callback(null, false);
        }
    });
});
exports.verifyCloth = ((wId, cId, callback) => {
    let queryString = 'Select * From WardrobesClothes Where wId = ? And cId = ?';
    db_1.sqlClient.query(queryString, [wId, cId], (err, result) => {
        if (err) {
            callback(err);
        }
        ;
        if (result.length > 0) {
            callback(null, true);
        }
        else {
            callback(null, false);
        }
    });
});
function checkCredentials(x, y) {
    if ((x != null) && (y != null)) {
        return true;
    }
    return false;
}
exports.checkCredentials = checkCredentials;
//# sourceMappingURL=Auth.js.map