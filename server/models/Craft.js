"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCraft = exports.Craft = exports.craftSchema = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var joi_1 = __importDefault(require("joi"));
exports.craftSchema = new mongoose_1.default.Schema({
    text: {
        type: String || Boolean
    },
    photo: {
        type: String || Boolean
    },
    author: {
        type: Object,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    comments: {
        type: [Object],
        default: []
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    }
});
exports.Craft = mongoose_1.default.model('Craft', exports.craftSchema);
exports.validateCraft = function (craft) {
    var schema = joi_1.default.object({
        text: typeof (craft.text) == "string" ? joi_1.default.string() : joi_1.default.boolean(),
        photo: typeof (craft.photo) == "string" ? joi_1.default.string() : joi_1.default.boolean(),
        author: joi_1.default.object().required(),
        date: joi_1.default.date().default(Date.now),
        comments: joi_1.default.array().default([]),
        likes: joi_1.default.number().default(0),
        dislikes: joi_1.default.number().default(0)
    });
    return schema.validate(craft);
};
