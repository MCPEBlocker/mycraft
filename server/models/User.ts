import mongoose = require('mongoose');
import Joi = require('joi');

export const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true,
        min: 5,
        max: 50
    },
    email: {
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
});

export const User = mongoose.model('User',userSchema);

export const validateUser: Function = (user: any) => {
    const schema = Joi.object({
        email: Joi.string().required(),
        username: Joi.string().required().min(5).max(50),
        password: Joi.string().required().min(8).max(16),
        followers: Joi.array(),
        followings: Joi.array(),
        isAdmin: Joi.boolean().default(false)
    });
    return schema.validate(user);
};

export interface UserType extends mongoose.Document {
    username: string,
    email: string,
    password: string,
    isAdmin: boolean,
    followers: any,
    followings: any,
}
