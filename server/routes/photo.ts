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
                const fileInfo = {
                    filename: filename,
                    bucketName: 'photos'
                };
                file.info = fileInfo;
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });

router.use(authMiddleware);
router.use(express.urlencoded({extended:false}));
router.use(express.json());

router.get('/all',(req: express.Request, res: express.Response) => {
    Photo.find((err: any, result: any) => {
        if(err)
            return res.status(400).send(err.message);
        if(!result[0] || result.length === 0){
            res.status(404).send(`Cannot find any image!`);
        } else {
            gfs.find().toArray((err: any, files: any) => {
                if(err)
                    res.status(400).send(err.message);
                if (!files || files.length === 0) {
                    return res.send('No photos found!');
                }
                res.send(files);
            });
        }
    });
});

router.get('/:filename',(req: express.Request, res: express.Response) => {
    Photo.findOne({ filename: req.params.filename },(err: any, result: PhotoType | null) => {
        if(err)
            return res.status(400).send(err.message);
        if(!result)
            return res.status(404).send(`Cannot find that photo!`);
        gfs.find({filename: result.filename}).toArray((err: any,files: any)=>{
            if(err)
                return res.status(400).send(err.message);
            if(!files[0] || files.length === 0) {
                return res.status(404).send(`No files available`);
            }
            if(files[0].contentType === 'image/jpeg' || files[0].contentType === 'image/png' || files[0].contentType === 'image/svg+xml') {
                gfs.openDownloadStreamByName(result.filename).pipe(res);
            } else {
                res.status(400).send({
                    err: 'Not an image'
                });
            }
        });
        
    });
});

router.post("/", upload.single("photo"), (req: express.Request, res: express.Response) => {
    if(!req.file)
        return res.status(400).send(`File is required!`);
    if(req.file.mimetype !== 'image/jpeg' && req.file.mimetype !== 'image/png' && req.file.mimetype !== 'image/svg+xml')
        return res.status(400).send(`Available types are "image/jpeg", "image/png", "image/svg+xml"`);
    const authUser = req.header("x-auth-username");
    if(!authUser)
        return res.status(400).send(`x-auth-username is required!`);
    User.findOne({ username: authUser },(err: any, result: UserType | null) => {
        if(err)
            res.status(400).send(err.message);
        if(!result)
            res.status(400).send(`Cannot find user with ${authUser} username`);
        const photo = new Photo({
            filename: req.file.filename,
            from: result
        });
        photo.save((err: any, product: mongoose.Document) => {
            if(err)
                res.status(400).send(err.message);
            res.status(201).send(product);
        });
    });
});

router.delete('/:filename',(req: express.Request,res: express.Response) => {
    Photo.findOne({ filename: req.params.filename },(err: any, result: PhotoType | null) => {
        if(err)
            return res.status(400).send(err.message);
        if(!result)
            return res.status(404).send(`Cannot find that photo`);
        gfs.find({filename: result.filename}).toArray((err: any, files: any) => {
            if(err)
                return res.status(400).send(err.message);
            if(!files[0] || files.length === 0)
                return res.status(404).send(`Cannot find that photo!`);
            gfs.delete(new mongoose.Types.ObjectId(files[0]._id), (err: any,data: any) => {
                if(err)
                    return res.status(400).send(err.message);
                res.send(`Photo deleted!`);
            });
        });
    });
});

export = router;