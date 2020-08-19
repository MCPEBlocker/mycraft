import express from 'express';
const router: express.Router = express.Router();
import { Craft, validateCraft, CraftType } from '../models/Craft';
import { User, UserType } from '../models/User';
import mongoose from 'mongoose';
import authMiddleware from "../middlewares/request";
import winston from 'winston';
const logger: winston.Logger = winston.createLogger({
    transports: [
        new winston.transports.File({filename: './logs/crafting.log'})
    ]
})

router.use(authMiddleware);
router.use(express.json());
router.use(express.urlencoded({extended:false}));

router.get('/all',(req: express.Request, res: express.Response) => {
    Craft.find((err: any, result: CraftType) => {
        if(err) {
            logger.warn(err.message, {date: Date.now});
            return res.status(400).send(err.message);
        }
        if(!result)
            return res.status(404).send(`Cannot find any crafts!`);
        res.send(result);
    });
});

router.get('/:id',(req: express.Request, res: express.Response) => {
    Craft.findById(req.params.id, (err: any, result: CraftType) => {
        if(err) {
            logger.warn(err.message, {date: Date.now});
            return res.status(400).send(err.message);
        }
        if(!result)
            return res.status(404).send(`Cannot find that craft!`);
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
        const newCraft = {
            text: req.body.text || false,
            photo: req.body.photo || false,
            author: result
        }
        const { error } = validateCraft(newCraft);
        if(error)
            return res.status(400).send(error.details[0].message);
        new Craft(newCraft).save((err: any, product: mongoose.Document) => {
            if(err) {
                logger.warn(err.message, {date: Date.now});
                return res.status(400).send(err.message);
            }
            logger.info(`New craft created`, {craft: product});
            res.status(201).send(product);
        });
    });
});

router.put('/:id',(req: express.Request, res: express.Response) => {
    Craft.findById(req.params.id,(err: any, oldcraft: CraftType | null) => {
        if(err) {
            logger.warn(err.message, {date: Date.now});
            return res.status(400).send(err.message);
        }
        if(!oldcraft)
            return res.status(404).send(`Cannot find that craft!`);
        const editedCraft = {
            text: req.body.text || oldcraft.text,
            author: oldcraft.author
        };
        const { error } = validateCraft(editedCraft);
        if(error)
            return res.status(400).send(error.details[0].message);
        Craft.findByIdAndUpdate(req.params.id, {
            $set: editedCraft
        }, (err: any, result: mongoose.Document | null) => {
            if(err) {
                logger.warn(err.message,{date: Date.now});
                return res.status(400).send(err.message);
            }
            if(!result)
                return res.status(404).send(`Cannot find that craft`);
            logger.info(`Craft edited`,{craft: result});
            res.send(result);
        });    
    });
});

router.delete('/:id',(req: express.Request, res: express.Response) => {
    Craft.findByIdAndRemove(req.params.id,(err: any, result: mongoose.Document | null) => {
        if(err) {
            logger.warn(err.message,{date: Date.now});
            return res.status(400).send(err.message);
        }
        if(!result)
            return res.status(404).send(`Cannot find that craft!`);
        logger.info(`Craft deleted.`,{craft: result});
        res.send(result);
    });
});

export = router;