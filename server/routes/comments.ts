import express from 'express';
const router: express.Router = express.Router();
import { Comment, validateComment, CommentType} from '../models/Comment';
import { Craft, validateCraft, CraftType } from '../models/Craft';
import { User, UserType } from '../models/User';
import mongoose from 'mongoose';
import authMiddleware from "../middlewares/request";
import winston from 'winston';
const logger: winston.Logger = winston.createLogger({
    transports: [
        new winston.transports.File({filename: './logs/comments.log'})
    ]
})

router.use(authMiddleware);
router.use(express.json());
router.use(express.urlencoded({extended:false}));

router.get('/all',(req: express.Request, res: express.Response) => {
    Comment.find((err: any, result: CommentType) => {
        if(err) {
            logger.warn(err.message, {date: Date.now});
            return res.status(400).send(err.message);
        }
        if(!result)
            return res.status(404).send(`Cannot find any Comments!`);
        res.send(result);
    });
});

router.get('/:id',(req: express.Request, res: express.Response) => {
    Comment.findById(req.params.id, (err: any, result: CommentType) => {
        if(err) {
            logger.warn(err.message, {date: Date.now});
            return res.status(400).send(err.message);
        }
        if(!result)
            return res.status(404).send(`Cannot find that Comment!`);
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
        const newComment = {
            text: req.body.text || false,
            photo: req.body.photo || false,
            author: result,
            craft: req.body.craft
        }
        const { error } = validateComment(newComment);
        if(error)
            return res.status(400).send(error.details[0].message);
        Craft.findById(req.body.craft, (err: any, result: CraftType | null) => {
            if(err) {
                logger.warn(err.message, {date: Date.now});
                return res.status(400).send(err.message);
            }
            if(!result)
                return res.status(400).send(`Cannot find that craft!`);
            result.comments.push(newComment);
            new Comment(newComment).save((err: any, product: mongoose.Document) => {
                if(err) {
                    logger.warn(err.message, {date: Date.now});
                    return res.status(400).send(err.message);
                }
                logger.info(`New Comment created`, {Comment: product});
                res.status(201).send(product);
            });
        });
    });
});

router.put('/:id',(req: express.Request, res: express.Response) => {
    Comment.findById(req.params.id,(err: any, oldComment: CommentType | null) => {
        if(err) {
            logger.warn(err.message, {date: Date.now});
            return res.status(400).send(err.message);
        }
        if(!oldComment)
            return res.status(404).send(`Cannot find that Comment!`);
        const editedComment = {
            text: req.body.text || oldComment.text,
            author: oldComment.author,
            craft: oldComment.craft
        };
        const { error } = validateComment(editedComment);
        if(error)
            return res.status(400).send(error.details[0].message);
        Comment.findByIdAndUpdate(req.params.id, {
            $set: editedComment
        }, (err: any, result: mongoose.Document | null) => {
            if(err) {
                logger.warn(err.message,{date: Date.now});
                return res.status(400).send(err.message);
            }
            if(!result)
                return res.status(404).send(`Cannot find that Comment`);
            logger.info(`Comment edited`,{Comment: result});
            res.send(result);
        });    
    });
});

router.delete('/:id',(req: express.Request, res: express.Response) => {
    Comment.findByIdAndRemove(req.params.id,(err: any, result: mongoose.Document | null) => {
        if(err) {
            logger.warn(err.message,{date: Date.now});
            return res.status(400).send(err.message);
        }
        if(!result)
            return res.status(404).send(`Cannot find that Comment!`);
        logger.info(`Comment deleted.`,{Comment: result});
        res.send(result);
    });
});

export = router;