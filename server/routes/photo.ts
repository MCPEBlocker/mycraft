import express from 'express';
const router: express.Router = express.Router();
import config from 'config';
import multer from 'multer';
import GridFsStorage from 'multer-gridfs-storage';
import authMiddleware from '../middlewares/request';
import mongoose, { mongo } from 'mongoose';
import crypto from 'crypto';
import path from 'path';
import { Photo, PhotoType } from '../models/Photo';
import { User, UserType } from '../models/User';

const connection: mongoose.Connection = mongoose.createConnection(config.get("mongodbURI"), {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let gfs: any;

connection.once('open',() => {
    gfs = new mongoose.mongo.GridFSBucket(connection.db, {
        bucketName: 'photos'
    });
});

const storage = new GridFsStorage({
    url: config.get("mongodbURI"),
    file: (req:express.Request, file: any) => {
        return new Promise((resolve: any, reject: any) => {
            crypto.randomBytes(16, (err: any, buf: Buffer) => {
                if(err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const username = req.header("x-auth-username");
                if(!username)
                    return reject("x-auth-username is required!");
                User.findOne({username: username},(err: any, result: UserType) => {
                    if(err)
                        return reject(err.message);
                    if(!result)
                        return reject('Incorrect username!');
                    const fileInfo = {
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
const upload = multer({ storage });

router.use(authMiddleware);
router.use(express.urlencoded({extended:false}));
router.use(express.json());

router.get('/all',(req: express.Request, res: express.Response) => {
    gfs.find().toArray((err: any, files: any) => {
        if (!files || files.length === 0) {
            return res.send('No photos found!');
        }
        res.send(files);
    });
});

router.get('/:filename',(req: express.Request, res: express.Response) => {
    gfs.find({filename: req.params.filename}).toArray((err: any,files: any)=>{
        if(!files[0] || files.length === 0) {
            return res.status(200).send(`No files available`);
        }

        if(files[0].contentType === 'image/jpeg' || files[0].contentType === 'image/png' || files[0].contentType === 'image/svg+xml') {
            gfs.openDownloadStreamByName(req.params.filename).pipe(res);
        } else {
            res.status(400).send({
                err: 'Not an image'
            });
        }
    });
});

router.post("/", upload.single("photo"), (req: express.Request, res: express.Response) => {
    if(!req.file)
        return res.status(400).send(`File is required!`);
    if(req.file.mimetype !== 'image/jpeg' && req.file.mimetype !== 'image/png' && req.file.mimetype !== 'image/svg+xml')
        return res.status(400).send(`Available types are "image/jpeg", "image/png", "image/svg+xml"`);
    res.send(req.file);
});

router.delete('/:filename',(req: express.Request,res: express.Response) => {
    gfs.find({filename: req.params.filename}).toArray((err: any, files: any) => {
        if(err)
            return res.status(400).send(err.message);
        if(!files[0] || files.length === 0)
            return res.status(404).send(`Cannot find that photo!`);
        gfs.delete(new mongoose.Types.ObjectId(files[0]._id), (err: any,data: any) => {
            if(err)
                return res.status(400).send(err.message);
            res.send(`Photo with ${req.params.filename} filename and ${files[0]._id} ID is deleted!`);
        });
    });
});

export = router;