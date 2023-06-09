// import { TokenModel } from '../models/token.model';
// import { ErrorHandlingService } from './error-handeling.service';
// const env = require('../../config/config');
// const config = require('../../config/config.json')[env.NODE_ENV.trim()];
// import { RedisService } from '../../utils/services/redis-services';
// import { EncryptionService } from './encryption.service';

var vNJwt = require('njwt');
var CryptoJS = require('crypto-js');
var signingKey = 'f2L03z2XKKyn2gztSbJ5x3l5T7m1CBSGmjQ8JkGAqbpt9UxxVmtia0mGblX5wSJuPFeAielpoYbhpR38tYZ36w' 
export class Token {
    constructor() {
        // Token.EncryptionService = new EncryptionService();
        console.log('initialize token service');
    }

    async createToken(pRequest, pResponse, cartId) {
        try {
            var claims = {
                mobile: encryptedString,
            }
            res.setHeader("accessToken", claims);
            pResponse.header('accessToken', await Token.encryptToken(claims));
            pResponse.header('created', Date.now());
            return "ok";
        }
        catch (pErr) {
            console.log("Token|createToken|catch|pErr: ", pErr)
            // ErrorHandlingService.throwError(300, pErr.message());
        }
    }

    static async encryptToken(pObject) {        
        console.log("Token|encryptToken|pObject: ", JSON.stringify(pObject))
        try {
            // encrypt token
            let vJwt = vNJwt.create(pObject, signingKey);
            let TokenExpiry = 3600;

            vJwt.setExpiration(new Date().getTime() + (TokenExpiry * 1000));
            return vJwt.compact();
        }
        catch (pErr) {
            console.log("Token|encryptToken|catch|pErr: ", JSON.stringify(pErr.stack))
            // ErrorHandlingService.throwHTTPErrorResponse(pErr.stack, 500, 300, pErr.message);
        }
    }    

    static async decryptToken(pToken) {
        try {
            let verifiedToken = vNJwt.verify(pToken, signingKey);
            return verifiedToken;
        }
        catch (pErr) {
            console.log("Token|decryptToken|catch|pErr: ", JSON.stringify(pErr.stack))
            return false
        }
    }

    static decryptBody(pToken) {
        try {
            var arr = pToken.split('.');
            var words = CryptoJS.enc.Base64.parse(arr[1]);
            return CryptoJS.enc.Utf8.stringify(words);
            // return jsonString;
        }
        catch (pErr) {
            console.log("Token|decryptBody|catch|pErr: ", JSON.stringify(pErr))
            ErrorHandlingService.throwHTTPErrorResponse(pErr.stack, 500, 300, pErr.message);
        }
    }

    async verifyToken(pRequest, pResponse, next) {
        let errRes;
        if (pRequest.method == 'OPTIONS')
            next();
        try {
            if (pRequest && pRequest.headers.authorization) {
                let vToken = pRequest.get('authorization').replace('Bearer ', '');
                let vTokenObject = await Token.decryptToken(vToken);
                console.log('Token|verifyToken|vTokenObject: ', JSON.stringify(vTokenObject))
                if(vTokenObject != false){
                    pResponse.locals.token = vTokenObject;
                    pRequest.accessToken = vToken;
                    pResponse.header('accessToken', vToken);
                    pRequest.user = vTokenObject;
                    next();
                } else {
                    errRes = {
                        "StatusCode": "Fail",
                        "error": {
                            "code": "300",
                            "message": "Invalid Access Token",
                            "details": "",
                            "displayMessage": "Internal Server Error"
                        },
                        "moreInfo": ""
                    };
                    pResponse.status(403).send(errRes);
                }
                
            } else {
                errRes = {
                    "StatusCode": "Fail",
                    "error": {
                        "code": "300",
                        "message": "Token Not Available",
                        "details": "",
                        "displayMessage": "Internal Server Error"
                    },
                    "moreInfo": ""
                };
                pResponse.status(403).send(errRes);
            }
        }
        catch (error) {
            console.log("Token|verifyToken|catch|error: ", JSON.stringify(error.stack));
            errRes = {
                "StatusCode": "Fail",
                "error": {
                    "code": "300",
                    "message": "Invalid Access Token",
                    "details": "",
                    "displayMessage": "Internal Server Error"
                },
                "moreInfo": ""
            };
            pResponse.status(403).send(errRes);
        }
    } 
}
Token.vTimeout = 60 * 60 * 24000; //24 hours
