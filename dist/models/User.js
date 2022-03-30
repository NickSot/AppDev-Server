"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wardList = exports.userDelFromWardrobe = exports.userToWardrobe = exports.update = exports.find = exports.remove = exports.login = exports.create = void 0;
const db_1 = require("../db");
const create = (user, callback) => {
    let queryString = `Insert Into Users (Email, NickName, Pass, Avatar, Gender, OauthToken) Values (
        ?, ?, ?, ?, ?, ?    )`;
    db_1.sqlClient.query(queryString, [user.email, user.nickname, user.password, user.avatar, user.gender, user.OauthToken], (err, result) => {
        if (err) {
            callback(err);
        }
        else {
            const insertId = result.insertId;
            callback(null, insertId);
        }
    });
};
exports.create = create;
exports.login = ((nickname, password, callback) => {
    let queryString = 'Select * From Users Where (NickName = ? Or Email = ?) And Pass = ?';
    db_1.sqlClient.query(queryString, [nickname, nickname, password], (err, result) => {
        if (err) {
            return callback(err);
        }
        ;
        if (result.length > 0) {
            const row = result[0];
            const user = {
                id: row.uId,
                nickname: row.NickName,
                email: row.Email,
                gender: row.Gender,
                avatar: row.Avatar,
                password: row.Pass,
                OauthToken: row.OauthToken
            };
            callback(null, user, row.uId);
        }
        else {
            callback(null, null);
        }
    });
});
const remove = (userId, callback) => {
    let queryString = `Delete From Users Where uId = ?`;
    db_1.sqlClient.query(queryString, [userId], (err, result) => {
        if (err) {
            return callback(err);
        }
        ;
        const affectedRows = result.affectedRows;
        callback(null, affectedRows);
    });
};
exports.remove = remove;
const find = (userId, callback) => {
    let queryString = `Select * From Users Where uId = ?`;
    db_1.sqlClient.query(queryString, [userId], (err, result) => {
        if (err) {
            return callback(err);
        }
        ;
        const row = result[0];
        const user = {
            nickname: row.NickName,
            email: row.Email,
            gender: row.Gender,
            avatar: row.Avatar,
            password: row.Pass,
            OauthToken: row.OauthToken
        };
        callback(null, user);
    });
};
exports.find = find;
const update = (userId, updateValues, callback) => {
    let queryString = `Update Users Set Nickname = ?, Email = ?, Pass = ?, OauthToken = ?, Gender = ?, Avatar = ? Where uId = ?`;
    db_1.sqlClient.query(queryString, [updateValues.nickname, updateValues.email,
        updateValues.password, updateValues.OauthToken, updateValues.gender,
        updateValues.avatar, userId], (err, result) => {
        if (err) {
            return callback(err);
        }
        ;
        callback(null, result.affectedRows);
    });
};
exports.update = update;
exports.userToWardrobe = ((userId, wardrobeId, callback) => {
    let queryString = 'Insert Into UsersWardrobes (uId, wId) Values (?,?    )';
    db_1.sqlClient.query(queryString, [userId, wardrobeId], (err, result) => {
        if (err) {
            return callback(err);
        }
        ;
        callback(null, result.affectedRows);
    });
});
exports.userDelFromWardrobe = ((userId, wardrobeId, callback) => {
    let queryString = 'Call DeleteWardrobeUserRelationship(?, ?    )';
    db_1.sqlClient.query(queryString, [userId, wardrobeId], (err, result) => {
        if (err) {
            return callback(err);
        }
        ;
        callback(null, result.affectedRows);
    });
});
exports.wardList = ((userId, callback) => {
    let queryString = 'Select w.wId, w.Nickname, w.CreationTime, w.WardrobeType, w.AdminId From Users u Inner Join UsersWardrobes uw On u.uId = uw.uId Inner Join Wardrobes w On w.wId = uw.wId Where u.uId = ?';
    db_1.sqlClient.query(queryString, [userId], (err, result) => {
        if (err) {
            return callback(err);
        }
        callback(null, result);
    });
});
//# sourceMappingURL=User.js.map