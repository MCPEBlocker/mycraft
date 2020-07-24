"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
const config = require("./config.json");
const mongoose = require('mongoose');
const winston = require('winston');
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename:'./logs/index.log'})
    ]
});

const authRoute = require('./routes/auth');

mongoose.connect(config.mongodbURI,{
    useNewUrlParser:true,
    useFindAndModify:true,
    useUnifiedTopology:true,
    useCreateIndex:true
},(err)=>{
    if(err)
    return logger.error(`Can't connect to mongodb cloud!`);
});

app.use('/api/auth',authRoute);

app.get("/", function (req, res) {
    res.send("/ main page");
});

app.listen(config.port, function () {
    console.log("Up and running on https://localhost:" + config.port);
});
