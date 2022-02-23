"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.find = exports.remove = exports.create = void 0;
const db_1 = require("../db");
const create = (user, callback) => {
    let queryString = `Insert Into Users (Email, NickName, Pass, Avatar, Gender, OauthToken) Values (
        ?, ?, ?, ?, ?, ?    )`;
    db_1.sqlClient.query(queryString, [user.nickname, user.email, user.password, user.avatar, user.gender, user.OauthToken], (err, result) => {
        if (err) {
            callback(err);
        }
        ;
        const insertId = result.insertId;
        callback(null, insertId);
    });
};
exports.create = create;
const remove = (userId, callback) => {
    let queryString = `Delete From Users Where uId = ?`;
    db_1.sqlClient.query(queryString, [userId], (err, result) => {
        if (err) {
            callback(err);
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
            callback(err);
        }
        ;
        const row = result[0];
        const user = {
            nickname: row.Nickname,
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
            callback(err);
        }
        ;
        callback(null);
    });
};
exports.update = update;
//# sourceMappingURL=User.js.map