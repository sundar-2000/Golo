const Controller = require('./controller');
const db = require('./db.js');
const redis = require("redis");
var controller = new Controller();


class routes {

    constructor() {
        const redisClient = redis.createClient();
        redisClient.on("error", function (error) {
            console.error(error);
        });

    }

    async getUserinfo(req, res) {
        let query = `select * from users where mobile = ${req.params.id}`;
        let result = await db.executeQuery(query);
        if (!result)
            return result;
        return result.rows;
    }

    async getUserHistory(req, res) {
        let query = `select * from orders where mobile = ${req.params.id}`;
        let result = await db.executeQuery(query)
        return result.rows;
    }

    async getDriverHistory(req, res) {
        let query = `select * from orders where drivermobile = ${req.params.id}`;
        let result = await db.executeQuery(query)
        console.log(result);
        return result.rows;
    }

    async bookDriver(req, res) {
        const user = req.payload;
        let result = await controller.getDriverList(user);
        return result;
    }

    async signupUser(req, res) {
        const user = req.payload;
        user.pswd = await controller.getHash(user.pswd);
        let result = await controller.addUser(user);
        return result;
    }

    async loginUser(req, res) {
        const user = req.payload;
        user.pswd = await controller.getHash(user.pswd);
        let result = await controller.loginUser(user);
        return result;
    }

    async loginDriver(req, res) {
        const user = req.payload;
        user.pswd = await controller.getHash(user.pswd);
        let result = await controller.loginDriver(user);
        return result;

    }

    async addDriver(req, res) {
        const user = req.payload;
        user.pswd = await controller.getHash(user.pswd);
        let result = await controller.addDriver(user);
        return result;
    }

}


module.exports = routes;

