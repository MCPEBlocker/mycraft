"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateComment = exports.Comment = exports.commentSchema = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var joi_1 = __importDefault(require("joi"));
exports.commentSchema = new mongoose_1.default.Schema({
    text: {
        type: String || Boolean
    },
    photo: {
        type: String || Boolean
    },
    craft: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    author: {
        type: Object,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
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
exports.Comment = mongoose_1.default.model('Craft', exports.commentSchema);
exports.validateComment = function (comment) {
    var schema = joi_1.default.object({
        text: typeof (comment.text) == "string" ? joi_1.default.string() : joi_1.default.boolean(),
        photo: typeof (comment.photo) == "string" ? joi_1.default.string() : joi_1.default.boolean(),
        craft: joi_1.default.string().required(),
        author: joi_1.default.object().required(),
        date: joi_1.default.date().default(Date.now),
        likes: joi_1.default.number().default(0),
        dislikes: joi_1.default.number().default(0)
    });
    return schema.validate(comment);
};
