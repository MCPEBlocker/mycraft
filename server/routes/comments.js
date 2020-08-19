"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var Comment_1 = require("../models/Comment");
var Craft_1 = require("../models/Craft");
var User_1 = require("../models/User");
var request_1 = __importDefault(require("../middlewares/request"));
var winston_1 = __importDefault(require("winston"));
var logger = winston_1.default.createLogger({
    transports: [
        new winston_1.default.transports.File({ filename: './logs/comments.log' })
    ]
});
router.use(request_1.default);
router.use(express_1.default.json());
router.use(express_1.default.urlencoded({ extended: false }));
router.get('/all', function (req, res) {
    Comment_1.Comment.find(function (err, result) {
        if (err) {
            logger.warn(err.message, { date: Date.now });
            return res.status(400).send(err.message);
        }
        if (!result)
            return res.status(404).send("Cannot find any Comments!");
        res.send(result);
    });
});
router.get('/:id', function (req, res) {
    Comment_1.Comment.findById(req.params.id, function (err, result) {
        if (err) {
            logger.warn(err.message, { date: Date.now });
            return res.status(400).send(err.message);
        }
        if (!result)
            return res.status(404).send("Cannot find that Comment!");
        res.send(result);
    });
});
router.post('/', function (req, res) {
    var authUsername = req.header("x-auth-username");
    if (!authUsername)
        return res.status(400).send("x-auth-username is required!");
    User_1.User.findOne({ username: authUsername }, function (err, result) {
        if (err) {
            logger.warn(err.message, { date: Date.now });
            return res.status(400).send(err.message);
        }
        if (!result)
            return res.status(404).send("Cannot find user with " + authUsername);
        var newComment = {
            text: req.body.text || false,
            photo: req.body.photo || false,
            author: result,
            craft: req.body.craft
        };
        var error = Comment_1.validateComment(newComment).error;
        if (error)
            return res.status(400).send(error.details[0].message);
        Craft_1.Craft.findById(req.body.craft, function (err, result) {
            if (err) {
                logger.warn(err.message, { date: Date.now });
                return res.status(400).send(err.message);
            }
            if (!result)
                return res.status(400).send("Cannot find that craft!");
            result.comments.push(newComment);
            new Comment_1.Comment(newComment).save(function (err, product) {
                if (err) {
                    logger.warn(err.message, { date: Date.now });
                    return res.status(400).send(err.message);
                }
                logger.info("New Comment created", { Comment: product });
                res.status(201).send(product);
            });
        });
    });
});
router.put('/:id', function (req, res) {
    Comment_1.Comment.findById(req.params.id, function (err, oldComment) {
        if (err) {
            logger.warn(err.message, { date: Date.now });
            return res.status(400).send(err.message);
        }
        if (!oldComment)
            return res.status(404).send("Cannot find that Comment!");
        var editedComment = {
            text: req.body.text || oldComment.text,
            author: oldComment.author,
            craft: oldComment.craft
        };
        var error = Comment_1.validateComment(editedComment).error;
        if (error)
            return res.status(400).send(error.details[0].message);
        Comment_1.Comment.findByIdAndUpdate(req.params.id, {
            $set: editedComment
        }, function (err, result) {
            if (err) {
                logger.warn(err.message, { date: Date.now });
                return res.status(400).send(err.message);
            }
            if (!result)
                return res.status(404).send("Cannot find that Comment");
            logger.info("Comment edited", { Comment: result });
            res.send(result);
        });
    });
});
router.delete('/:id', function (req, res) {
    Comment_1.Comment.findByIdAndRemove(req.params.id, function (err, result) {
        if (err) {
            logger.warn(err.message, { date: Date.now });
            return res.status(400).send(err.message);
        }
        if (!result)
            return res.status(404).send("Cannot find that Comment!");
        logger.info("Comment deleted.", { Comment: result });
        res.send(result);
    });
});
module.exports = router;
