import express from 'express';
const router: express.Router = express.Router();
import { User, validateUser, UserType } from '../models/User';
import bcrypt from 'bcrypt';
import authMiddleware from '../middlewares/request';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import config from 'config';
import winston from 'winston';
const logger = winston.createLogger({
    transports: [
        new winston.transports.File({filename: './logs/auth.log'})
    ]
});

router.use(express.json());
router.use(express.urlencoded({extended:false}));
router.use(authMiddleware);

router.get('/',(req: express.Request,res: express.Response)=>{
    User.find((err: any,result: any)=>{
        if(err) {
            logger.warn(err.message, {date: Date.now});
            return res.status(400).send(err.message);
        }
        res.send(result);
    });
});

router.get('/getToken/:username',(req:express.Request, res:express.Response) => {
    User.findOne({username:req.params.username},(err: any, result:UserType) => {
        if(err) {
            logger.warn(err.message, {date: Date.now});
            return res.status(400).send(err.message);
        }
        if(!result)
            return res.status(404).send(`Cannot find user with "${req.params.username}" username!`);
        const authToken: any = jwt.sign({
            id: result._id,
            username: result.username
        },config.get("jwtSecretKey"));
        logger.info(`Token generated!`,{token: authToken});
        res.send(authToken);
    });
});

router.get('/:username',(req: express.Request,res: express.Response) => {
    User.findOne({username:req.params.username},(err: any,result: any)=>{
        if(err) {
            logger.warn(err.message, {date: Date.now});
            return res.status(400).send(err.message);
        }
        if(!result)
            return res.status(404).send(`Cannot find user with "${req.params.username}" username!`);
        res.send(result);
    });
});

router.post('/',(req: express.Request,res: express.Response)=>{
    User.findOne({email: req.body.email},(err: any,result: mongoose.Document | null) => {
        if(err) {
            logger.warn(err.message, {date: Date.now});
            return res.status(400).send(err.message);
        }
        if(result)
            return res.status(400).send('Mail is already registered!');
        User.findOne({username: req.body.username},(err: any,obj: mongoose.Document | null)=>{
            if(err) {
                logger.warn(err.message, {date: Date.now});
                return res.status(400).send(err.message);
            }
            if(obj)
                return res.status(400).send('Username is already taken!');
            const new_user = {
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
                followers: req.body.followers || [],
                followings: req.body.followings || [],
                isAdmin: req.body.isAdmin || false
            };
            const { error } = validateUser(new_user);
            if(error)
                return res.status(500).send(error.details[0].message);
            bcrypt.genSalt((err: any,salt: any) => {
                if(err) {
                    logger.warn(err.message, {date: Date.now});
                    return res.status(500).send(err.message);
                }
                bcrypt.hash(req.body.password,salt,(err: any,password: any) => {
                    if(err) {
                        logger.warn(err.message, {date: Date.now});
                        return res.status(500).send(err.message);
                    }
                    new_user.password = password;
                    const user = new User(new_user);
                    user.save((err: any,product: mongoose.Document | null) => {
                        if(err) {
                            logger.warn(err.message, {date: Date.now});
                            return res.status(400).send(err.message);
                        }
                        logger.info(`New user registered!`,{user: product});
                        res.status(201).send(product);
                    });
                });
            });
        });
    });
});

router.put('/:username',(req: express.Request,res: express.Response) => {
    User.findOne({username: req.params.username},(err: any, result: UserType | null) => {
        if(err) {
            logger.warn(err.message, {date: Date.now});
            return res.status(400).send(err.message);
        }
        if(!result)
            return res.status(404).send(`Cannot find that user!`);
        const edited_user = {
            username: req.body.username || result.username,
            email: req.body.email || result.email,
            password: req.body.password,
            followers: req.body.followers || result.followers,
            followings: req.body.followings || result.followings,
            isAdmin: req.body.isAdmin || result.isAdmin
        };
        const { error } = validateUser(edited_user);
        if(error)
            return res.status(400).send(error.details[0].message);
        bcrypt.hash(edited_user.password, 10, (err: any,password: string) => {
            if(err) {
                logger.warn(err.message, {date: Date.now});
                return res.status(500).send(err.message);
            }
            edited_user.password = password;
            result.username = edited_user.username;
            result.password = edited_user.password;
            result.email = edited_user.email;
            result.followers = edited_user.followers;
            result.followings = edited_user.followings;
            result.isAdmin = edited_user.isAdmin;
            result.save((err:any, product: mongoose.Document | null) => {
                if(err) {
                    logger.warn(err.message, {date: Date.now});
                    return res.status(400).send(err.message);
                }
                logger.info(`User is edited!`,{user: product});
                res.send(product);
            });
        });
    });
});

router.delete('/:username',(req:express.Request, res:express.Response) => {
    User.findOneAndRemove({username: req.params.username},(err:any,result:mongoose.Document | null) => {
        if(err) {
            logger.warn(err.message, {date: Date.now});
            return res.status(400).send(err.message);
        }
        logger.info(`User is deleted!`,{user: result});
        res.send(result);
    });
});

export = router;