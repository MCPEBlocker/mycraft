import mongoose from 'mongoose';
import Joi from 'joi';
import { userSchema } from './User';

export interface NewType extends mongoose.Document {
    title: string,
    description?: string | boolean,
    content: string,
    photo?: string | boolean,
    author: object,
    date?: string
}

export const newSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String || Boolean,
        default: false
    },
    content: {
        type: String
    },
    photo: {
        type: String || Boolean,
        default: false
    },
    author: {
        type: Object,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export const New = mongoose.model('New',newSchema);

export const validateNew: Function = (thatNew: NewType) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        description: typeof(thatNew.title) == "string" ? Joi.string() : Joi.boolean(),
        content: Joi.string().required(),
        photo: typeof(thatNew.photo) == "string" ? Joi.string() : Joi.boolean(),
        author: Joi.object().required(),
        date: Joi.date().default(Date.now)
    });
    return schema.validate(thatNew);
};