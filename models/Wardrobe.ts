import { sqlClient } from '../db';
import { OkPacket, RowDataPacket } from "mysql2";

export interface Wardrobe {
    uId: number,
    id?: number,
    nickname: string,
    creationTime?: Date;
    wardrobeType: string;
}

export const create = (wardrobe: Wardrobe, callback: Function) => {
    let queryString: string = `Insert Into Wardrobes (NickName, CreationTime, WardrobeType) Values (
        ?, ?, ?    )`;

    let queryString2: string = 'Insert Into UsersWardrobes (uId, wId) Values (?,?    )';

    sqlClient.query(queryString, [wardrobe.nickname, wardrobe.creationTime, wardrobe.wardrobeType]
        , (err, result) => {
            if (err) { callback(err) };

            const insertId = (<OkPacket> result).insertId;

            sqlClient.query(queryString2, [wardrobe.uId, insertId]);

            callback(null, insertId);
        });
};

export const remove = (wardrobeId: number, callback: Function) => {
    let queryString = `Delete From Wardrobes Where wId = ?`;
    let queryString2 = `Delete From UsersWardrobes Where wId = ?`;

    sqlClient.query(queryString, [wardrobeId], (err, result) => {
        if (err) {callback(err)};

        const affectedRows = (<OkPacket> result).affectedRows;

        sqlClient.query(queryString2, [wardrobeId]);

        callback(null, affectedRows);
    });
}

export const find = (wardrobeId: number, callback: Function) => {
    let queryString = `Select * From Wardrobes Where wId = ?`;

    sqlClient.query(queryString, [wardrobeId], (err, result) => {
        if (err) {callback(err)};

        const row = (<RowDataPacket> result)[0];

        const wardrobe: Wardrobe  = {
            uId: -1,
            nickname: row.NickName,
            creationTime: row.CreationTime,
            wardrobeType: row.WardrobeType
        };

        callback(null, wardrobe);
    });
}

export const update = (wardrobeId: number, updateValues: Wardrobe, callback: Function) => {
    let queryString = `Update Wardrobes Set NickName = ?, CreationTime = ?, WardrobeType = ? Where wId = ?`;

    sqlClient.query(queryString, [updateValues.nickname, updateValues.creationTime,
         updateValues.wardrobeType, wardrobeId],
    (err, result) => {
        if (err) {callback(err)};

        callback(null, (<OkPacket>result).affectedRows);
    });
}

export const clothList = ((wardrobeId: number, callback: Function) => {
    let queryString = 'Select cId From Wardrobes w Inner Join WardrobesClothes wc On w.wId = wc.wId Where w.wId = ?'

    sqlClient.query(queryString, [wardrobeId], (err, result) => {
        if(err) {callback(err)}

        callback(null, <RowDataPacket> result)
    })
});