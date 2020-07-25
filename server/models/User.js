"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = exports.User = void 0;
var mongoose = require("mongoose");
var Joi = require("joi");
exports.User = mongoose.model('User', new mongoose.Schema({
    username: {
        unique: true,
        type: String,
        required: true,
        min: 5,
        max: 50
    },
    email: {
        unique: true,
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 1024
    },
    followers: {
        type: [mongoose.SchemaTypes.ObjectId],
        default: []
    },
    followings: {
        type: Array,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}));
exports.validateUser = function (user) {
    var schema = Joi.object({
        email: Joi.string().required(),
        username: Joi.string().required().min(5).max(50),
        password: Joi.string().required().min(8).max(16),
        followers: Joi.array(),
        followings: Joi.array(),
        isAdmin: Joi.boolean().default(false)
    });
    return schema.validate(user);
};
