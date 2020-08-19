import express from 'express';
const router: express.Router = express.Router();
import { New, validateNew, NewType } from '../models/New';
import { User, UserType } from '../models/User';
import mongoose from 'mongoose';
import authMiddleware from "../middlewares/request";
import winston from 'winston';
const logger: winston.Logger = winston.createLogger({
    transports: [
        new winston.transports.File({filename: './logs/Newing.log'})
    ]
})

router.use(authMiddleware);
router.use(express.json());
router.use(express.urlencoded({extended:false}));

router.get('/all',(req: express.Request, res: express.Response) => {
    New.find((err: any, result: NewType) => {
        if(err) {
            logger.warn(err.message, {date: Date.now});
            return res.status(400).send(err.message);
        }
        if(!result)
            return res.status(404).send(`Cannot find any News!`);
        res.send(result);
    });
});

router.get('/:id',(req: express.Request, res: express.Response) => {
    New.findById(req.params.id, (err: any, result: NewType) => {
        if(err) {
            logger.warn(err.message, {date: Date.now});
            return res.status(400).send(err.message);
        }
        if(!result)
            return res.status(404).send(`Cannot find that New!`);
        res.send(result);
    });
});

router.post('/',(req: express.Request, res: express.Response) => {
    const authUsername = req.header("x-auth-username");
    if(!authUsername)
        return res.status(400).send(`x-auth-username is required!`);
    User.findOne({ username: authUsername },(err: any, result: UserType) => {
        if(err) {
            logger.warn(err.message, {date: Date.now});
            return res.status(400).send(err.message);
        }
        if(!result)
            return res.status(404).send(`Cannot find user with ${authUsername}`);
        const newNew = {
            title: req.body.title,
            description: req.body.photo || false,
            photo: req.body.photo || false,
            author: result
        }
        const { error } = validateNew(newNew);
        if(error)
            return res.status(400).send(error.details[0].message);
        new New(newNew).save((err: any, product: mongoose.Document) => {
            if(err) {
                logger.warn(err.message, {date: Date.now});
                return res.status(400).send(err.message);
            }
            logger.info(`New New created`, {New: product});
            res.status(201).send(product);
        });
    });
});

router.put('/:id',(req: express.Request, res: express.Response) => {
    New.findById(req.params.id,(err: any, oldNew: NewType | null) => {
        if(err) {
            logger.warn(err.message, {date: Date.now});
            return res.status(400).send(err.message);
        }
        if(!oldNew)
            return res.status(404).send(`Cannot find that New!`);
        const editedNew = {
            title: req.body.title || oldNew.title,
            description: req.body.description || oldNew.description,
            author: oldNew.author
        };
        const { error } = validateNew(editedNew);
        if(error)
            return res.status(400).send(error.details[0].message);
        New.findByIdAndUpdate(req.params.id, {
            $set: editedNew
        }, (err: any, result: mongoose.Document | null) => {
            if(err) {
                logger.warn(err.message,{date: Date.now});
                return res.status(400).send(err.message);
            }
            if(!result)
                return res.status(404).send(`Cannot find that New`);
            logger.info(`New edited`,{New: result});
            res.send(result);
        });    
    });
});

router.delete('/:id',(req: express.Request, res: express.Response) => {
    New.findByIdAndRemove(req.params.id,(err: any, result: mongoose.Document | null) => {
        if(err) {
            logger.warn(err.message,{date: Date.now});
            return res.status(400).send(err.message);
        }
        if(!result)
            return res.status(404).send(`Cannot find that New!`);
        logger.info(`New deleted.`,{New: result});
        res.send(result);
    });
});

export = router;