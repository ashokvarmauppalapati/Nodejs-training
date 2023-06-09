var Redis = require('ioredis');
// Create a Redis instance.
// By default, it will connect to localhost:6379.
// We are going to cover how to specify connection options soon.
var redis;
let conf;
export class RedisService {
    constructor() {
        try {
            conf = {
                port: 6379, // Redis port
                host: "127.0.0.1", // Redis host
                db: 0, // Defaults to 0
            }
        }
        catch (pErr) {
            console.log("RedisService|catch|pErr", JSON.stringify(pErr))
        }
    }

    static async redisConnect(conf) {
        if(redisClient && redisClient.connected) {
            return redisClient;
        }
        let redisClient = new Redis(conf);
        await redisClient.connect();
        console.log(redisClient.status);
        if(redisClient.status == 'ready'){
            redis = {
                cacheClient: redisClient,
                connected: true
            }
            return redis;
        } else {
            console.log("RedisService|redisWriteConnect|catch|Err");
        }
    }

    static async setVal(val, key, time) {
        try {
            await RedisService.redisConnect(conf);
            await redis.cacheClient.set(key, val);
            return true;
        }
        catch (pErr) {
            console.log("RedisService|setVal|catch|pSetErr", pErr)
            return false;
        }
    }

    static async getVal(key) {
        try {
            return await RedisService.c(key);
        }
        catch (pErr) {
            console.log("RedisService|getVal|catch|pGetErr", JSON.stringify(pErr))
            return null;
        }
    }

    static async checkExists(val) {
        try {
            return await redis.setAsynccheckExists(val);
        }
        catch (pErr) {
            console.log("RedisService|checkExists|catch|pChkErr", JSON.stringify(pErr))
            return null;
        }
    }


    static async delKey(key) {
        try {            
            return await redis.setAsyncdelKey(key);
        }
        catch (pErr) {
            console.log("RedisService|delKey|catch|pDelErr", JSON.stringify(pErr))
            return null;
        }
    }
}
