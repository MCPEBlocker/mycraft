import mongoose from 'mongoose';
import Joi from 'joi';

export interface CommentType extends mongoose.Document {
    text?: string | boolean,
    photo?: string | boolean,
    craft: mongoose.Types.ObjectId,
    author: object,
    date?: string,
    likes?: number,
    dislikes?: number
}

export const commentSchema = new mongoose.Schema({
    text: {
        type: String || Boolean
    },
    photo: {
        type: String || Boolean
    },
    craft: {
        type: mongoose.Types.ObjectId,
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

export const Comment = mongoose.model('Craft',commentSchema);

export const validateComment: Function = (comment: CommentType) => {
    const schema = Joi.object({
        text: typeof(comment.text) == "string" ? Joi.string() : Joi.boolean(),
        photo: typeof(comment.photo) == "string" ? Joi.string() : Joi.boolean(),
        craft: Joi.string().required(),
        author: Joi.object().required(),
        date: Joi.date().default(Date.now),
        likes: Joi.number().default(0),
        dislikes: Joi.number().default(0)
    });
    return schema.validate(comment);
};