const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    username: {
        unique: true,
        type: String,
        required: true,
        min: 5,
        max: 50
    },
    email: {
        unique:true,
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 1024
    },
    followers: [mongoose.SchemaTypes.ObjectId],
    followings: [mongoose.SchemaTypes.ObjectId]
});

const User = mongoose.model('User',userSchema);

function validateUser(user) {
    const schema = Joi.object({
        email: Joi.string().required(),
        username: Joi.string().required().min(5).max(50),
        password: Joi.string().required().min(8).max(16),
        followers: Joi.array(),
        followings: Joi.array()
    });
    return schema.validate(user);
};

exports.User = User;
exports.validateUser = validateUser;