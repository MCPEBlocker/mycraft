"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var Craft_1 = require("../models/Craft");
var User_1 = require("../models/User");
var request_1 = __importDefault(require("../middlewares/request"));
router.use(request_1.default);
router.use(express_1.default.json());
router.use(express_1.default.urlencoded({ extended: false }));
router.get('/all', function (req, res) {
    Craft_1.Craft.find(function (err, result) {
        if (err)
            return res.status(400).send(err.message);
        if (!result)
            return res.status(404).send("Cannot find any crafts!");
        res.send(result);
    });
});
router.get('/:id', function (req, res) {
    Craft_1.Craft.findById(req.params.id, function (err, result) {
        if (err)
            res.status(400).send(err.message);
        if (!result)
            res.status(404).send("Cannot find that craft!");
        res.send(result);
    });
});
router.post('/', function (req, res) {
    var authUsername = req.header("x-auth-username");
    if (!authUsername)
        return res.status(400).send("x-auth-username is required!");
    User_1.User.findOne({ username: authUsername }, function (err, result) {
        if (err)
            return res.status(400).send(err.message);
        if (!result)
            return res.status(404).send("Cannot find user with " + authUsername);
        var newCraft = {
            text: req.body.text || false,
            photo: req.body.photo || false,
            author: result
        };
        var error = Craft_1.validateCraft(newCraft).error;
        if (error)
            return res.status(400).send(error.details[0].message);
        new Craft_1.Craft(newCraft).save(function (err, product) {
            if (err)
                return res.status(400).send(err.message);
            res.status(201).send(product);
        });
    });
});
router.delete('/:id', function (req, res) {
    Craft_1.Craft.findByIdAndRemove(req.params.id, function (err, result) {
        if (err)
            return res.status(400).send(err.message);
        if (!result)
            return res.status(404).send("Cannot find that craft!");
        res.send(result);
    });
});
module.exports = router;
