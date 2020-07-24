import express = require('express');
const router: express.IRouter = express.Router();
import { User, validateUser } from '../models/User';
import bcrypt = require('bcrypt');
import authMiddleware from '../middlewares/request';

router.use(express.json());
router.use(express.urlencoded({extended:false}));
router.use(authMiddleware);

router.get('/',(req: any,res: any)=>{
    User.find((err: any,result: any)=>{
        if(err)
            return res.status(400).send(err.message);
        res.send(result);
    });
});

router.get('/:username',(req: any,res: any) => {
    User.findOne({username:req.params.username},(err: any,result: any)=>{
        if(err)
            return res.status(400).send(err.message);
        if(!result)
            return res.status(404).send(`Cannot find user with "${req.params.username}" username!`);
        res.send(result);
    });
});

router.post('/',(req: any,res: any)=>{
    User.findOne({email: req.body.email},(err: any,result: any) => {
        if(err)
            return res.status(400).send(err.message);
        if(result)
            return res.status(400).send('Mail is already registered!');
        User.findOne({username: req.body.username},(err: any,obj: any)=>{
            if(err)
                return res.status(400).send(err.message);
            if(obj)
                return res.status(400).send('Username is already taken!');
            const new_user = {
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
                followers: [],
                followings: []
            };
            const { error } = validateUser(new_user);
            if(error)
                return res.status(500).send(error.details[0].message);
            bcrypt.genSalt((err: any,salt: any) => {
                if(err)
                    return res.status(500).send(err.message);
                bcrypt.hash(req.body.password,salt,(err: any,password: any) => {
                    if(err)
                        return res.status(500).send(err.message);
                    new_user.password = password;
                    const user = new User(new_user);
                    user.save((err: any,product: any) => {
                        if(err)
                            return res.status(400).send(err.message);
                        res.status(201).send(product);
                    });
                });
            });
        });
    });
});

export = router;