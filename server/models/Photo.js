"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Photo = exports.PhotoSchema = void 0;
var mongoose = require("mongoose");
exports.PhotoSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    caption: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    from: {
        type: Object,
        required: true
    }
});
exports.Photo = mongoose.model('Photo', exports.PhotoSchema);
