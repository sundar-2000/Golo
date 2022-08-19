const rmq = require('./rmq.js');
const db = require('./db.js');
const redis = require("redis");
const redisClient = redis.createClient();


class controller {

    constructor() {
        redisClient.on("error", function (error) {
            console.error(error);
        });
    }

    async bookDriver(user, result) {

        var driver = {}, dist = Infinity;
        var data = result['drivers']
        data.forEach(e => {
            let curDist = Math.abs(user.from - e.location);
            if (curDist < dist) {
                dist = curDist;
                driver = e;
            }
        });

        let otp = Math.floor(1000 + Math.random() * 9000);
        let driverText = `Hello, ${driver.name} kindly pick up ${user.name} in ${user.from} and drop them to ${user.to}. Your OTP number for the travel is ${otp}.`
        let userText = `Hello, ${user.name} your travel from ${user.from} to ${user.to} will be taken care by ${driver.name}. Your OTP number for the travel is ${otp}.`
        var result = {};
        result.msg = userText;

        //add history to db
        let insertQuery = `insert into orders (mobile,source,destination,driver,drivermobile,username) values ('${user.mobile}','${user.from}','${user.to}','${driver.name}','${driver.mobile}','${user.name}')`;
        let getQuery = `select earnings from drivers where mobile =${driver.mobile}`

        await db.executeQuery(insertQuery);
        let results = await db.executeQuery(getQuery);
        if (!results) {

            let earnings = results.rows[0].earnings + (Math.abs(user.from - user.to) * 5);
            let updateQuery = `update drivers set earnings = '${earnings}' where mobile = ${driver.mobile}`;
            await db.executeQuery(updateQuery);

        }
        else { console.log("error"); };

        //send message
        //rmq.sendNotification(driver.mobile, driverText);
        //rmq.sendNotification(user.mobile, userText);
        return result;

    }

    async cacheResults(result) {
        result.forEach(driver => [
            redisClient.RPUSH('drivers', JSON.stringify(driver))
        ])
    }

    async getHash(word) {

        const crypto = require('crypto')
        let hashPwd = crypto.createHash('sha256').update(word).digest('hex');
        return hashPwd;
    }

    async getDriverList(user) {
        var self = this;
        return new Promise((resolve, reject) => {
            let res = 0;
            redisClient.LRANGE("drivers", 0, -1, async function (err, reply) {
                // reply is null when the key is missing
                var result = { 'fromCache': false }
                if (reply.length) {
                    result['fromCache'] = true;
                    let data = [];
                    for (var driver of reply) {
                        data.push(JSON.parse(driver));
                    }
                    result['drivers'] = data;
                    let resp = self.bookDriver(user, result);
                    console.log(resp);
                    return resolve(resp);
                }
                else {
                    let query = `select mobile,name,location from drivers`;
                    let data = await db.executeQuery(query);
                    if (data) {
                        result['drivers'] = data.rows;
                        cacheResults(data.rows);
                        let resp = self.bookDriver(user, result);
                        return resolve(resp);
                    }
                    else{
                        return resolve(JSON.stringify({ 'msg': 'Unable ot get Drivers. please try again later' }))
                    }
                        
                }

            });
        })

    }

    async addUser(user) {

        return new Promise(async (resolve, reject) => {
            let checkQuery = `select exists(select 1 from users where mobile=${user.mobile})`;
            let result = await db.executeQuery(checkQuery);

            if (result) {
                //console.log(result.rows[0]);
                if (result.rows[0].exists) {
                    return resolve(JSON.stringify(result.rows[0]));
                }
                else {
                    let insertQuery = `insert into users (mobile,name,pswd) values ('${user.mobile}','${user.name}','${user.pswd}')`;
                    let _result = await db.executeQuery(insertQuery)

                    if (_result) {
                        console.log('User Added');
                        return resolve(JSON.stringify(result.rows[0]));

                    }
                    else { console.log("error adding user"); return reject("error adding user") };
                }
            }
            else { console.log("Error adding user"); };

        })
    }

    async loginUser(user) {
        return new Promise(async (resolve, reject) => {
            let valiadteQuery = `select * from users where mobile='${user.mobile}'`;
            let result = await db.executeQuery(valiadteQuery);
            if (result) {
                if (user.pswd != result.rows[0].pswd) {
                    return resolve(JSON.stringify({ 'isValid': false }));
                }

                else {
                    result.rows[0].isValid = true;
                    return resolve(JSON.stringify(result.rows[0]));
                }
            }
            else { console.log("Error in logging in") };

        })

    }

    async loginDriver(user) {
        return new Promise(async (resolve, reject) => {
            let valiadteQuery = `select * from drivers where mobile='${user.mobile}'`;
            let result = await db.executeQuery(valiadteQuery);

            if (result) {
                if (user.pswd != result.rows[0].pswd) {
                    return resolve(JSON.stringify({ 'isValid': false }));
                }

                else {
                    result.rows[0].isValid = true;
                    return resolve(JSON.stringify(result.rows[0]));
                }
            }
            else { console.log(err.message); res.send(err) };

        })
    }

    async addDriver(user) {
        return new Promise(async (resolve, reject) => {
            let checkQuery = `select exists(select 1 from drivers where mobile=${user.mobile})`;
            let result = await db.executeQuery(checkQuery);

            if (result) {
                //console.log(result.rows[0]);
                if (result.rows[0].exists) {
                    return resolve(JSON.stringify(result.rows[0]));
                }
                else {

                    let insertQuery = `insert into drivers (mobile,name,location,earnings,pswd) values ('${user.mobile}','${user.name}',0,0,'${user.pswd}')`;
                    let _result = await db.executeQuery(insertQuery);

                    if (_result) {
                        console.log(result);
                        return resolve(JSON.stringify(result.rows[0]));
                    }
                    else {
                        console.log("error fetching data");
                        return reject('User already exists')
                    };

                }
            }
            else { console.log(err.message); res.send(err) };

            redisClient.RPUSH("drivers", JSON.stringify(user));
        })
    }

}



module.exports = controller;
