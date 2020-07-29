"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var config_1 = __importDefault(require("config"));
var multer_1 = __importDefault(require("multer"));
var multer_gridfs_storage_1 = __importDefault(require("multer-gridfs-storage"));
var request_1 = __importDefault(require("../middlewares/request"));
var mongoose_1 = __importDefault(require("mongoose"));
var crypto_1 = __importDefault(require("crypto"));
var path_1 = __importDefault(require("path"));
var Photo_1 = require("../models/Photo");
var User_1 = require("../models/User");
var winston_1 = __importDefault(require("winston"));
var logger = winston_1.default.createLogger({
    transports: [
        new winston_1.default.transports.File({ filename: './logs/photo.log' })
    ]
});
var connection = mongoose_1.default.createConnection(config_1.default.get("mongodbURI"), {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var gfs;
connection.once('open', function () {
    gfs = new mongoose_1.default.mongo.GridFSBucket(connection.db, {
        bucketName: 'photos'
    });
});
var storage = new multer_gridfs_storage_1.default({
    url: config_1.default.get("mongodbURI"),
    file: function (req, file) {
        return new Promise(function (resolve, reject) {
            crypto_1.default.randomBytes(16, function (err, buf) {
                if (err) {
                    logger.warn(err.message, { date: Date.now });
                    return reject(err);
                }
                var filename = buf.toString('hex') + path_1.default.extname(file.originalname);
                var fileInfo = {
                    filename: filename,
                    bucketName: 'photos'
                };
                file.info = fileInfo;
                resolve(fileInfo);
            });
        });
    }
});
var upload = multer_1.default({ storage: storage });
// router.use(authMiddleware);
router.use(express_1.default.urlencoded({ extended: false }));
router.use(express_1.default.json());
router.get('/all', request_1.default, function (req, res) {
    Photo_1.Photo.find(function (err, result) {
        if (err) {
            logger.warn(err.message, { date: Date.now });
            return res.status(400).send(err.message);
        }
        if (!result[0] || result.length === 0) {
            return res.status(404).send("Cannot find any image!");
        }
        else {
            gfs.find().toArray(function (err, files) {
                if (err) {
                    logger.warn(err.message, { date: Date.now });
                    return res.status(400).send(err.message);
                }
                if (!files || files.length === 0) {
                    return res.send('No photos found!');
                }
                res.send(files);
            });
        }
    });
}).stack;
router.get('/:filename', function (req, res) {
    Photo_1.Photo.findOne({ filename: req.params.filename }, function (err, result) {
        if (err) {
            logger.warn(err.message, { date: Date.now });
            return res.status(400).send(err.message);
        }
        if (!result)
            return res.status(404).send("Cannot find that photo!");
        gfs.find({ filename: result.filename }).toArray(function (err, files) {
            if (err) {
                logger.warn(err.message, { date: Date.now });
                return res.status(400).send(err.message);
            }
            if (!files[0] || files.length === 0) {
                return res.status(404).send("No files available");
            }
            if (files[0].contentType === 'image/jpeg' || files[0].contentType === 'image/png' || files[0].contentType === 'image/svg+xml') {
                gfs.openDownloadStreamByName(result.filename).pipe(res);
            }
            else {
                res.status(400).send('Not an image');
            }
        });
    });
});
router.post("/", request_1.default, upload.single("photo"), function (req, res) {
    if (!req.file)
        return res.status(400).send("File is required!");
    if (req.file.mimetype !== 'image/jpeg' && req.file.mimetype !== 'image/png' && req.file.mimetype !== 'image/svg+xml')
        return res.status(400).send("Available types are \"image/jpeg\", \"image/png\", \"image/svg+xml\"");
    var authUser = req.header("x-auth-username");
    if (!authUser)
        return res.status(400).send("x-auth-username is required!");
    User_1.User.findOne({ username: authUser }, function (err, result) {
        if (err) {
            logger.warn(err.message, { date: Date.now });
            return res.status(400).send(err.message);
        }
        if (!result)
            return res.status(400).send("Cannot find user with " + authUser + " username");
        var photo = new Photo_1.Photo({
            filename: req.file.filename,
            from: result
        });
        photo.save(function (err, product) {
            if (err) {
                logger.warn(err.message, { date: Date.now });
                return res.status(400).send(err.message);
            }
            logger.info("New photo uploaded", { photo: product });
            res.status(201).send(product);
        });
    });
});
router.delete('/:filename', request_1.default, function (req, res) {
    Photo_1.Photo.findOne({ filename: req.params.filename }, function (err, result) {
        if (err) {
            logger.warn(err.message, { date: Date.now });
            return res.status(400).send(err.message);
        }
        if (!result)
            return res.status(404).send("Cannot find that photo");
        gfs.find({ filename: result.filename }).toArray(function (err, files) {
            if (err) {
                logger.warn(err.message, { date: Date.now });
                return res.status(400).send(err.message);
            }
            if (!files[0] || files.length === 0)
                return res.status(404).send("Cannot find that photo!");
            gfs.delete(new mongoose_1.default.Types.ObjectId(files[0]._id), function (err, data) {
                if (err) {
                    logger.warn(err.message, { date: Date.now });
                    return res.status(400).send(err.message);
                }
                logger.info("Photo deleted!", { photo: data });
                res.send("Photo deleted!");
            });
        });
    });
});
module.exports = router;
