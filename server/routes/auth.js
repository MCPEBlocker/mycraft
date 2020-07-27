"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var User_1 = require("../models/User");
var bcrypt_1 = __importDefault(require("bcrypt"));
var request_1 = __importDefault(require("../middlewares/request"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var config_1 = __importDefault(require("config"));
router.use(express_1.default.json());
router.use(express_1.default.urlencoded({ extended: false }));
router.use(request_1.default);
router.get('/', function (req, res) {
    User_1.User.find(function (err, result) {
        if (err)
            return res.status(400).send(err.message);
        res.send(result);
    });
});
router.get('/getToken/:username', function (req, res) {
    User_1.User.findOne({ username: req.params.username }, function (err, result) {
        if (err)
            return res.status(400).send(err.message);
        if (!result)
            return res.status(404).send("Cannot find user with \"" + req.params.username + "\" username!");
        var authToken = jsonwebtoken_1.default.sign({
            id: result._id,
            username: result.username
        }, config_1.default.get("jwtSecretKey"));
        res.send(authToken);
    });
});
router.get('/:username', function (req, res) {
    User_1.User.findOne({ username: req.params.username }, function (err, result) {
        if (err)
            return res.status(400).send(err.message);
        if (!result)
            return res.status(404).send("Cannot find user with \"" + req.params.username + "\" username!");
        res.send(result);
    });
});
router.post('/', function (req, res) {
    User_1.User.findOne({ email: req.body.email }, function (err, result) {
        if (err)
            return res.status(400).send(err.message);
        if (result)
            return res.status(400).send('Mail is already registered!');
        User_1.User.findOne({ username: req.body.username }, function (err, obj) {
            if (err)
                return res.status(400).send(err.message);
            if (obj)
                return res.status(400).send('Username is already taken!');
            var new_user = {
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
                followers: req.body.followers || [],
                followings: req.body.followings || [],
                isAdmin: req.body.isAdmin || false
            };
            var error = User_1.validateUser(new_user).error;
            if (error)
                return res.status(500).send(error.details[0].message);
            bcrypt_1.default.genSalt(function (err, salt) {
                if (err)
                    return res.status(500).send(err.message);
                bcrypt_1.default.hash(req.body.password, salt, function (err, password) {
                    if (err)
                        return res.status(500).send(err.message);
                    new_user.password = password;
                    var user = new User_1.User(new_user);
                    user.save(function (err, product) {
                        if (err)
                            return res.status(400).send(err.message);
                        res.status(201).send(product);
                    });
                });
            });
        });
    });
});
router.put('/:username', function (req, res) {
    User_1.User.findOne({ username: req.params.username }, function (err, result) {
        if (err)
            return res.status(400).send(err.message);
        if (!result)
            return res.status(404).send("Cannot find that user!");
        var edited_user = {
            username: req.body.username || result.username,
            email: req.body.email || result.email,
            password: req.body.password,
            followers: req.body.followers || result.followers,
            followings: req.body.followings || result.followings,
            isAdmin: req.body.isAdmin || result.isAdmin
        };
        var error = User_1.validateUser(edited_user).error;
        if (error)
            return res.status(400).send(error.details[0].message);
        bcrypt_1.default.hash(edited_user.password, 10, function (err, password) {
            if (err)
                return res.status(500).send(err.message);
            edited_user.password = password;
            result.username = edited_user.username;
            result.password = edited_user.password;
            result.email = edited_user.email;
            result.followers = edited_user.followers;
            result.followings = edited_user.followings;
            result.isAdmin = edited_user.isAdmin;
            result.save(function (err, product) {
                if (err)
                    return res.status(400).send(err.message);
                res.send(product);
            });
        });
    });
});
router.delete('/:username', function (req, res) {
    User_1.User.findOneAndRemove({ username: req.params.username }, function (err, result) {
        if (err)
            return res.status(400).send(err.message);
        res.send(result);
    });
});
module.exports = router;
