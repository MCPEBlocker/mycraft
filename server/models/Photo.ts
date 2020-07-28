import mongoose = require('mongoose');

export const PhotoSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
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

export const Photo = mongoose.model('Photo',PhotoSchema);

export interface PhotoType extends mongoose.SchemaType {
    filename: string,
    date?: string,
    from: string
}