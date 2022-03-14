"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = void 0;
const db_1 = require("../db");
exports.verifyUser = ((nickname, password, callback) => {
    let queryString = 'Select uId From Users Where NickName = ? And Pass = ?';
    db_1.sqlClient.query(queryString, [nickname, password], (err, result) => {
        if (err) {
            callback(err);
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
//# sourceMappingURL=Auth.js.map