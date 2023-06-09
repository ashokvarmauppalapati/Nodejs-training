import { Token } from '../services/token.serivce';
import axios from 'axios';
const Redis = require("ioredis");
// import { RedisService } from '../services/redis.service';
export class UserController {
    constructor() {
        UserController.Token = new Token();
    }

    async getToken(req, res) {
        try {
            var tokenObj = {
                mobile: '9876543210',
            }
            let vNewAccessToken = await Token.encryptToken(tokenObj);
            res.header('accessToken', vNewAccessToken);
            res.header('created', Date.now());
            // await RedisService.setVal('token', vNewAccessToken);
            res.send("Token created");
        } catch (error) {
            console.log("ContentController|getContent|error: ", JSON.stringify(error.stack));
        }
    }

    async validateToken(req, res) {
        try {
            res.send("Token verified successfuly through middleware")
        } catch (error) {
            console.log("ContentController|getContent|error: ", JSON.stringify(error.stack));
        }
    }

    async getUsers(req, res) {
        try {
            // calling public api to get user data
            const redis = new Redis({
                port: 6379, // Redis port
                host: "127.0.0.1", // Redis host
            });
            let userData;
            let userDataExits = await redis.get("userData");
            if(!userDataExits){
                userData = await UserController.callPublicAPI();
                
                redis.set("userData", JSON.stringify(userData));
                redis.expire("userData", 3600);
                res.send(userData);
            } else {
                res.send(JSON.parse(userDataExits));
            }
            
        } catch (error) {
            console.log("ContentController|getContent|error: ", JSON.stringify(error.stack));
        }
    }

    static async callPublicAPI(){
        try{
            let response = await axios.get('https://gorest.co.in/public/v2/users');
            if(response.status == 200){
                console.log("userData >>>>>>>>>>>>>>", response.data);
                let data = response.data;
                return data
            }
        }catch(err){
            console.log("ERR:::::::", err);
        }
    }
}
