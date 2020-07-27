import mongoose from 'mongoose';
import Joi from 'joi';
import { userSchema } from './User';

export interface CraftType extends mongoose.Document {
    text?: string | boolean,
    photo?: string | boolean,
    author: object,
    date?: string,
    comments?: any,
    likes?: number,
    dislikes?: number
}

export const craftSchema = new mongoose.Schema({
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

export const Craft = mongoose.model('Craft',craftSchema);

export const validateCraft: Function = (craft: CraftType) => {
    const schema = Joi.object({
        text: typeof(craft.text) == "string" ? Joi.string() : Joi.boolean(),
        photo: typeof(craft.photo) == "string" ? Joi.string() : Joi.boolean(),
        author: Joi.object().required(),
        date: Joi.date().default(Date.now),
        comments: Joi.array().default([]),
        likes: Joi.number().default(0),
        dislikes: Joi.number().default(0)
    });
    return schema.validate(craft);
};