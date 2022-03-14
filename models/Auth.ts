import { sqlClient } from '../db';
import { OkPacket, RowDataPacket } from "mysql2";

export const verifyUser = ((nickname: string, password: string, callback: Function) => {
    let queryString: string = 'Select uId From Users Where NickName = ? And Pass = ?'

    sqlClient.query(queryString, [nickname, password], (err, result) => {
        if (err) { callback(err) };

        let uIdRes = null;

        if((<RowDataPacket>result).length > 0){
            uIdRes = (<RowDataPacket>result)[0].uId;
            callback(null, uIdRes);
        }
        else{
            callback(null, null);
        }
    })
});