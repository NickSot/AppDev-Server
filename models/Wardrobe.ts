import { sqlClient } from '../db';
import fs from 'fs';
import { OkPacket, RowDataPacket } from "mysql2";

export interface Wardrobe {
    uId: number,
    id?: number,
    nickname: string,
    creationTime?: Date,
    wardrobeType: string,
    adminId: number
}

export const create = (wardrobe: Wardrobe, callback: Function) => {
    let queryString: string = `Insert Into Wardrobes (NickName, CreationTime, WardrobeType, AdminId) Values (
        ?, ?, ?, ?)`;

    let queryString2: string = 'Insert Into UsersWardrobes (uId, wId) Values (?,?)';

    sqlClient.query(queryString, [wardrobe.nickname, wardrobe.creationTime, wardrobe.wardrobeType, wardrobe.adminId]
        , (err, result) => {
            if (err) { return callback(err); };

            const insertId = (<OkPacket> result).insertId;

            sqlClient.query(queryString2, [wardrobe.uId, insertId]);

            callback(null, insertId);
        });
};

export const remove = (wardrobeId: number, callback: Function) => {
    let queryString = `Delete From Wardrobes Where wId = ?`;
    let queryString2 = `Delete From UsersWardrobes Where wId = ?`;

    sqlClient.query(queryString, [wardrobeId], (err, result) => {
        if (err) {return callback(err)};

        const affectedRows = (<OkPacket> result).affectedRows;

        sqlClient.query(queryString2, [wardrobeId]);

        callback(null, affectedRows);
    });
}

export const find = (wardrobeId: number, callback: Function) => {
    let queryString = `Select * From Wardrobes Where wId = ?`;

    sqlClient.query(queryString, [wardrobeId], (err, result) => {
        if (err) {return callback(err)};

        const row = (<RowDataPacket> result)[0];

        const wardrobe: Wardrobe  = {
            uId: -1,
            nickname: row.NickName,
            creationTime: row.CreationTime,
            wardrobeType: row.WardrobeType,
            adminId: row.AdminId
        };

        callback(null, wardrobe);
    });
}

export const update = (wardrobeId: number, updateValues: Wardrobe, callback: Function) => {
    let queryString = `Update Wardrobes Set NickName = ?, CreationTime = ?, WardrobeType = ?, AdminId = ? Where wId = ?`;

    sqlClient.query(queryString, [updateValues.nickname, updateValues.creationTime, 
        updateValues.wardrobeType, updateValues.adminId, wardrobeId],
    (err, result) => {
        if (err) {return callback(err)};

        console.log(result);

        callback(null, (<OkPacket>result).affectedRows);
    });
}

export const clothList = ((wardrobeId: number, callback: Function) => {
    let queryString = 'Select c.cId, c.ClothType, c.Image, c.OriginalWardrobeId From Wardrobes w Inner Join WardrobesClothes wc On w.wId = wc.wId Inner Join Clothes c On c.cId = wc.cId Where w.wId = ?'

    sqlClient.query(queryString, [wardrobeId], (err, result) => {
        if(err) {return callback(err)}

        var clothList = new Array((<RowDataPacket> result).length);

        for(let i = 0; i < (<RowDataPacket> result).length; i++){
            var imageAsBase64 = fs.readFileSync((<RowDataPacket> result)[i].Image, 'base64');

            let cloth = {
                'clothType': (<RowDataPacket> result)[i].ClothType,
                'image': imageAsBase64,
                'originalWardrobeId': (<RowDataPacket> result)[i].OriginalWardrobeId
            }

            clothList[i] = cloth;
        }

        callback(null, clothList)
    })
});

export const userList = ((wardrobeId: number, callback: Function) => {
    let queryString = 'Select u.uId, u.Nickname From Wardrobes w Inner Join UsersWardrobes uw On w.wId = uw.wId Inner Join Users u On u.uId = uw.uId Where w.wId = ?'

    sqlClient.query(queryString, [wardrobeId], (err, result) => {
        if(err) {return callback(err)}

        callback(null, <RowDataPacket> result)
    })
});