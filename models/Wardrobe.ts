import { sqlClient } from '../db';
import { OkPacket, RowDataPacket } from "mysql2";

export interface Wardrobe {
    id?: number,
    nickname: string,
    creationTime?: Date;
    wardrobeType: string;
}

export const create = (wardrobe: Wardrobe, callback: Function) => {
    let queryString: string = `Insert Into Wardrobes (NickName, CreationTime, WardrobeType) Values (
        ?, ?, ?    )`;

    sqlClient.query(queryString, [wardrobe.nickname, wardrobe.creationTime, wardrobe.wardrobeType]
        , (err, result) => {
            if (err) { callback(err) };

            const insertId = (<OkPacket> result).insertId;
            callback(null, insertId);
        });
};

export const remove = (wardrobeId: number, callback: Function) => {
    let queryString = `Delete From Wardrobes Where wId = ?`;

    sqlClient.query(queryString, [wardrobeId], (err, result) => {
        if (err) {callback(err)};

        const affectedRows = (<OkPacket> result).affectedRows;
        callback(null, affectedRows);
    });
}

export const find = (wardrobeId: number, callback: Function) => {
    let queryString = `Select * From Wardrobes Where wId = ?`;

    sqlClient.query(queryString, [wardrobeId], (err, result) => {
        if (err) {callback(err)};

        const row = (<RowDataPacket> result)[0];

        const wardrobe: Wardrobe  = {
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