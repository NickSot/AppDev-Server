import { sqlClient } from '../db';
import { OkPacket, RowDataPacket } from "mysql2";

export interface Cloth {
    id?: number;
    clothType: string;
    image: string;
    originalWardrobeId: number;
    originalUserId?: number;
    originalUserName?: string;
}

export const create = (cloth: Cloth, callback: Function) => {
    let queryString: string = `Insert Into Clothes (ClothType, Image, OriginalWardrobeId, OriginalUser) Values (
        ?, ?, ?,?    )`;

        let queryString2: string = 'Insert Into WardrobesClothes (wId, cId) Values (?,?    )';

    sqlClient.query(queryString, [cloth.clothType, cloth.image, cloth.originalWardrobeId, cloth.originalUserId]
        , (err, result) => {
            if (err) { callback(err) };

            const insertId = (<OkPacket> result).insertId;

            sqlClient.query(queryString2, [cloth.originalWardrobeId, insertId]);

            callback(null, insertId);
        });
};

export const remove = (clothId: number, callback: Function) => {
    let queryString = `Delete From Clothes Where cId = ?`;
    let queryString2 = `Delete From WardrobesClothes Where cId = ?`;

    sqlClient.query(queryString, [clothId], (err, result) => {
        if (err) {callback(err)};

        const affectedRows = (<OkPacket> result).affectedRows;

        sqlClient.query(queryString2, [clothId]);

        callback(null, affectedRows);
    });
}

export const find = (clothId: number, callback: Function) => {
    let queryString = `Select * From Clothes Where cId = ?`;
    let queryString2 = 'Select * From Users Where uId = ?';

    sqlClient.query(queryString, [clothId], (err, result) => {
        if (err) {callback(err)};

        const row = (<RowDataPacket> result)[0];

        sqlClient.query(queryString2,[row.OriginalUser], (err, userRes) => {
            if(err) return callback(err);

            const row2 = (<RowDataPacket> userRes)[0];

            const cloth: Cloth  = {
                clothType: row.ClothType,
                image: row.Image,
                originalWardrobeId: row.OriginalWardrobeId,
                originalUserName: row2.NickName
            };
    
            callback(null, cloth);
        });
    });
}

export const update = (clothId: number, updateValues: Cloth, callback: Function) => {
    let queryString = `Update Clothes Set ClothType = ?, Image = ?, OriginalWardrobeId = ? Where cId = ?`;

    sqlClient.query(queryString, [updateValues.clothType, updateValues.image,
         updateValues.originalWardrobeId, clothId],
    (err, result) => {
        if (err) {callback(err)};

        callback(null, (<OkPacket>result).affectedRows);
    });
}

export const clothToWardrobe = ((clothId: number, wardrobeId: number, callback: Function) => {
    let queryString = 'Insert Into WardrobesClothes (cId, wId) Values (?,?    )';

    sqlClient.query(queryString, [clothId, wardrobeId], (err, result) => {
        if (err) {callback(err)};

        callback(null, (<OkPacket>result).affectedRows);
    });
});

export const clothDelFromWardrobe = ((clothId: number, wardrobeId: number, callback: Function) => {
    let queryString = 'Delete From WardrobesClothes Where cId = ? And wId = ?';

    sqlClient.query(queryString, [clothId, wardrobeId], (err, result) => {
        if (err) {callback(err)};

        callback(null, (<OkPacket>result).affectedRows);
    });
});