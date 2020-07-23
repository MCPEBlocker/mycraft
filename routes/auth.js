const express = require('express');
const router = express.Router();
const { User, validateUser } = require('../models/User');
const bcrypt = require('bcrypt');

router.post('/',(req,res)=>{
    User.findOne({email: req.body.email},(err,result) => {
        if(err)
            return res.status(400).send(err.message);
        if(result)
            return res.status(400).send('Mail is already registered!');
        const new_user = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            followers: [],
            followings: []
        };
        const { error } = validateUser(new_user);
        if(error)
            return res.status(400).send(error.details[0].message);
        bcrypt.genSalt((err,salt) => {
            if(err)
                return res.status(400).send(err.message);
            bcrypt.hash(req.body.password,salt,(err,password) => {
                if(err)
                    return res.status(400).send(err.message);
                new_user.password = password;
                const user = new User(new_user);
                user.save((err,product) => {
                if(err)
                return res.status(400).send(err.message);
                res.status(201).send(product);
                });
            });
        });
    });
});

module.exports = router;