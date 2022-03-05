import { sqlClient } from '../db';
import { OkPacket, RowDataPacket } from "mysql2";

export interface User {
    id?: number,
    nickname: string,
    email: string,
    avatar: Buffer | string,
    gender: string,
    password: string,
    OauthToken?: string,
}

export const create = (user: User, callback: Function) => {
    let queryString: string = `Insert Into Users (Email, NickName, Pass, Avatar, Gender, OauthToken) Values (
        ?, ?, ?, ?, ?, ?    )`;

    sqlClient.query(queryString, [user.email, user.nickname, user.password, user.avatar, user.gender, user.OauthToken]
        , (err, result) => {
            if (err) { callback(err) };

            const insertId = (<OkPacket> result).insertId;
            callback(null, insertId);
        });
};

export const login = ((nickname: string, password: string, callback: Function) => {
    let queryString: string = 'Select * From Users Where NickName = ? And Pass = ?'

    sqlClient.query(queryString, [nickname, password], (err, result) => {
        if (err) { callback(err) };

        const row = (<RowDataPacket> result)[0];
        
        const user: User  = {
            nickname: row.NickName,
            email: row.Email,
            gender: row.Gender,
            avatar: row.Avatar,
            password: row.Pass,
            OauthToken: row.OauthToken
        };

        callback(null, user);
    })
});

export const remove = (userId: number, callback: Function) => {
    let queryString = `Delete From Users Where uId = ?`;

    sqlClient.query(queryString, [userId], (err, result) => {
        if (err) {callback(err)};

        const affectedRows = (<OkPacket> result).affectedRows;
        callback(null, affectedRows);
    });
}

export const find = (userId: number, callback: Function) => {
    let queryString = `Select * From Users Where uId = ?`;

    sqlClient.query(queryString, [userId], (err, result) => {
        if (err) {callback(err)};

        const row = (<RowDataPacket> result)[0];

        const user: User  = {
            nickname: row.NickName,
            email: row.Email,
            gender: row.Gender,
            avatar: row.Avatar,
            password: row.Pass,
            OauthToken: row.OauthToken
        };

        callback(null, user);
    });
}

export const update = (userId: number, updateValues: User, callback: Function) => {
    let queryString = `Update Users Set Nickname = ?, Email = ?, Pass = ?, OauthToken = ?, Gender = ?, Avatar = ? Where uId = ?`;

    sqlClient.query(queryString, [updateValues.nickname, updateValues.email,
        updateValues.password, updateValues.OauthToken, updateValues.gender,
        updateValues.avatar, userId],
    (err, result) => {
        if (err) {callback(err)};

        callback(null, (<OkPacket>result).affectedRows);
    });
}

export const userToWardrobe = ((userId: number, wardrobeId: number, callback: Function) => {
    let queryString = 'Insert Into UsersWardrobes (uId, wId) Values (?,?    )';

    sqlClient.query(queryString, [userId, wardrobeId], (err, result) => {
        if (err) {callback(err)};

        callback(null, (<OkPacket>result).affectedRows);
    });
});

export const userDelFromWardrobe = ((userId: number, wardrobeId: number, callback: Function) => {
    let queryString = 'Delete From UsersWardrobes Where uId = ? And wId = ?';

    sqlClient.query(queryString, [userId, wardrobeId], (err, result) => {
        if (err) {callback(err)};

        callback(null, (<OkPacket>result).affectedRows);
    });
});