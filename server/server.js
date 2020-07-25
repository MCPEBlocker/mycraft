"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var express = require("express");
var app = express();
var config = require("./config.json");
var mongoose = require("mongoose");
var winston = require("winston");
var auth_1 = __importDefault(require("./routes/auth"));
var logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: './logs/index.log' })
    ]
});
var mongodbURI = process.env.mongodbURI;
mongoose.connect(mongodbURI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true
}, function (err) {
    if (err)
        return logger.error('Cannot connect to the mongodb cloud!');
});
app.use('/api/auth', auth_1.default);
app.get("/", function (req, res) {
    res.send("/ main page");
});
app.listen(config.port, function () {
    logger.info("Up and running on https://localhost:" + config.port);
});
