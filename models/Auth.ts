import { sqlClient } from '../db';
import { OkPacket, RowDataPacket } from "mysql2";

export const verifyUser = ((nickname: string, password: string, callback: Function) => {

    let queryString: string = 'Select uId From Users Where NickName = ? And Pass = ?'

    sqlClient.query(queryString, [nickname, password], (err, result) => {
        if (err) { return callback(err) };

        let uIdRes = null;

        if ((<RowDataPacket>result).length > 0){
            uIdRes = (<RowDataPacket>result)[0].uId;
            callback(null, uIdRes);
        }
        else {
            callback(null, null);
        }
    });
});

export const verifyUsername = ((email: string, nickname: string, callback: Function) => {
    let queryString: string = 'Select Email, Nickname From Users Where Email = ? Or Nickname = ?';

    sqlClient.query(queryString, [email, nickname],(err, result) => {
        if(err) return callback(err);

        if((<RowDataPacket>result).length > 0){
            callback(null, false);
        }
        else{
            callback(null, true);
        }
    });
});

export const verifyWardrobe = ((uId: number, wId: number, callback: Function) => {
    let queryString: string = 'Select * From UsersWardrobes Where uId = ? And wId = ?'

    sqlClient.query(queryString, [uId, wId], (err, result) => {
        if (err) {return callback(err) };

        if((<RowDataPacket>result).length > 0){
            callback(null, true);
        }
        else{
            callback(null, false);
        }
    });
});

export const verifyWardrobeShared = ((wId: number, callback: Function) => {
    let queryString: string = 'Select * From Wardrobes Where wId = ?'

    sqlClient.query(queryString, [wId], (err, result) => {
        if (err) {return callback(err) };

        console.log((<RowDataPacket>result)[0].wardrobeType);

        if((<RowDataPacket>result)[0].WardrobeType == 'Shared'){
            callback(null, true);
        }
        else{
            callback(null, false);
        }
    });
});

export const verifyClothOrigin = ((wId: number, cId:number, callback: Function) => {
    let queryString: string = 'Select * From Clothes Where OriginalWardrobeId = ? And cId = ?'

    sqlClient.query(queryString, [wId, cId], (err, result) => {
        if (err) {return callback(err) };

        if((<RowDataPacket>result).length > 0){
            callback(null, true);
        }
        else{
            callback(null, false);
        }
    });
});

export const verifyCloth = ((wId: number, cId:number, callback: Function) => {
    let queryString: string = 'Select * From WardrobesClothes Where wId = ? And cId = ?'

    sqlClient.query(queryString, [wId, cId], (err, result) => {
        if (err) {return callback(err) };

        if((<RowDataPacket>result).length > 0){
            callback(null, true);
        }
        else{
            callback(null, false);
        }
    });
});

export const checkAdmin = ((wId: number, adminId:number, callback: Function) => {
    let queryString: string = 'Select * From Wardrobes Where wId = ? And AdminId = ?'

    sqlClient.query(queryString, [wId, adminId], (err, result) => {
        if (err) {return callback(err) };

        if((<RowDataPacket>result).length > 0){
            callback(null, true);
        }
        else{
            callback(null, false);
        }
    });
});

export function checkCredentials(x: string, y: string){

    if((x != null) && (y != null)){
        return true;
    }

    return false;
}