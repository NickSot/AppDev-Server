"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCredentials = exports.checkAdmin = exports.verifyCloth = exports.verifyClothOrigin = exports.verifyWardrobeShared = exports.verifyWardrobe = exports.verifyUsername = exports.verifyUser = void 0;
const db_1 = require("../db");
exports.verifyUser = ((nickname, password, callback) => {
    let queryString = 'Select uId From Users Where NickName = ? And Pass = ?';
    db_1.sqlClient.query(queryString, [nickname, password], (err, result) => {
        if (err) {
            return callback(err);
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
exports.verifyUsername = ((email, nickname, callback) => {
    let queryString = 'Select Email, Nickname From Users Where Email = ? Or Nickname = ?';
    db_1.sqlClient.query(queryString, [email, nickname], (err, result) => {
        if (err)
            return callback(err);
        if (result.length > 0) {
            callback(null, false);
        }
        else {
            callback(null, true);
        }
    });
});
exports.verifyWardrobe = ((uId, wId, callback) => {
    let queryString = 'Select * From UsersWardrobes Where uId = ? And wId = ?';
    db_1.sqlClient.query(queryString, [uId, wId], (err, result) => {
        if (err) {
            return callback(err);
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
exports.verifyWardrobeShared = ((wId, callback) => {
    let queryString = 'Select * From Wardrobes Where wId = ?';
    db_1.sqlClient.query(queryString, [wId], (err, result) => {
        if (err) {
            return callback(err);
        }
        ;
        console.log(result[0].wardrobeType);
        if (result[0].WardrobeType == 'Shared') {
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
            return callback(err);
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
            return callback(err);
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
exports.checkAdmin = ((wId, adminId, callback) => {
    let queryString = 'Select * From Wardrobes Where wId = ? And AdminId = ?';
    db_1.sqlClient.query(queryString, [wId, adminId], (err, result) => {
        if (err) {
            return callback(err);
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