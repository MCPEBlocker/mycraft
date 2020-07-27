"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var User_1 = require("../models/User");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var config_1 = __importDefault(require("config"));
module.exports = function (req, res, next) {
    var token = req.header('x-api-token');
    if (!token) {
        return res.status(400).send("x-api-token header is required!");
    }
    else {
        try {
            var jwtKey = config_1.default.get("jwtSecretKey");
            if (!jwtKey)
                return res.status(500).send("jwt secret key not found!");
            var authUser_1 = jsonwebtoken_1.default.verify(token, config_1.default.get("jwtSecretKey"));
            User_1.User.findById(authUser_1.id, function (err, result) {
                if (err)
                    return res.status(400).send(err.message);
                if (!result)
                    return res.status(404).send("Cannot find user with " + authUser_1.username + " username!");
                if (result.isAdmin == true) {
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.setHeader("Access-Control-Allow-Methods", "*");
                    res.setHeader("Access-Control-Allow-Headers", "*");
                    next();
                }
                else {
                    return res.status(403).send("You cannot get this data!");
                }
            });
        }
        catch (ex) {
            return res.status(400).send(ex.message);
        }
    }
};
