"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var express = require("express");
var app = express();
var config_1 = __importDefault(require("config"));
var mongoose_1 = __importDefault(require("mongoose"));
var winston_1 = __importDefault(require("winston"));
var auth_1 = __importDefault(require("./routes/auth"));
var photo_1 = __importDefault(require("./routes/photo"));
var crafting_1 = __importDefault(require("./routes/crafting"));
var logger = winston_1.default.createLogger({
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({ filename: './logs/index.log' })
    ]
});
var mongodbURI = config_1.default.get("mongodbURI");
mongoose_1.default.connect(mongodbURI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true
}, function (err) {
    if (err)
        return logger.error('Cannot connect to the mongodb cloud!');
    logger.info("Connected to the mongodb cloud!");
});
app.use('/api/auth', auth_1.default);
app.use('/api/photo', photo_1.default);
app.use('/api/crafting', crafting_1.default);
app.get("/", function (req, res) {
    res.setHeader("Content-Type", "text/html");
    res.send("/ - main page<br /> /api/auth - users api<br /> /api/photo - api which working with photos<br /> /api/crafting - crafting api<br /> these are for now :)");
});
app.listen(process.env.PORT || config_1.default.get("port"), function () {
    logger.info("Up and running on https://localhost:" + (process.env.PORT || config_1.default.get("port")));
});
