"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var config = require("./config.json");
var app = express();
app.get("/", function (req, res) {
    res.send("/ main page");
});
app.listen(config.port, function () {
    console.log("Up and running on https://localhost:" + config.port);
});
