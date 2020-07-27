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
var User_1 = require("../models/User");
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
                    return reject(err);
                }
                var filename = buf.toString('hex') + path_1.default.extname(file.originalname);
                var username = req.header("x-auth-username");
                if (!username)
                    return reject("x-auth-username is required!");
                User_1.User.findOne({ username: username }, function (err, result) {
                    if (err)
                        return reject(err.message);
                    if (!result)
                        return reject('Incorrect username!');
                    var fileInfo = {
                        filename: filename,
                        caption: req.body.caption || '',
                        from: result,
                        bucketName: 'photos'
                    };
                    file.info = fileInfo;
                    resolve(fileInfo);
                });
            });
        });
    }
});
var upload = multer_1.default({ storage: storage });
router.use(request_1.default);
router.use(express_1.default.urlencoded({ extended: false }));
router.use(express_1.default.json());
router.get('/all', function (req, res) {
    gfs.find().toArray(function (err, files) {
        if (!files || files.length === 0) {
            return res.send('No photos found!');
        }
        res.send(files);
    });
});
router.get('/:filename', function (req, res) {
    gfs.find({ filename: req.params.filename }).toArray(function (err, files) {
        if (!files[0] || files.length === 0) {
            return res.status(200).send("No files available");
        }
        if (files[0].contentType === 'image/jpeg' || files[0].contentType === 'image/png' || files[0].contentType === 'image/svg+xml') {
            gfs.openDownloadStreamByName(req.params.filename).pipe(res);
        }
        else {
            res.status(400).send({
                err: 'Not an image'
            });
        }
    });
});
router.post("/", upload.single("photo"), function (req, res) {
    if (!req.file)
        return res.status(400).send("File is required!");
    if (req.file.mimetype !== 'image/jpeg' && req.file.mimetype !== 'image/png' && req.file.mimetype !== 'image/svg+xml')
        return res.status(400).send("Available types are \"image/jpeg\", \"image/png\", \"image/svg+xml\"");
    res.send(req.file);
});
router.delete('/:filename', function (req, res) {
    gfs.find({ filename: req.params.filename }).toArray(function (err, files) {
        if (err)
            return res.status(400).send(err.message);
        if (!files[0] || files.length === 0)
            return res.status(404).send("Cannot find that photo!");
        gfs.delete(new mongoose_1.default.Types.ObjectId(files[0]._id), function (err, data) {
            if (err)
                return res.status(400).send(err.message);
            res.send("Photo with " + req.params.filename + " filename and " + files[0]._id + " ID is deleted!");
        });
    });
});
module.exports = router;
