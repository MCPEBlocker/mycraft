import { User } from '../models/User';
import express from 'express';
import { Document } from 'mongoose';
import jwt from 'jsonwebtoken';
import config from 'config';

interface UserType extends Document {
    username: string,
    email: string,
    password: string,
    isAdmin: boolean,
    followers: any,
    followings: any,
}

export = (req: express.Request,res: express.Response,next: express.NextFunction) => {
    const token: any = req.header('x-api-token');
    if(!token){
        return res.status(400).send(`x-api-token header is required!`);
    } else {
        try {
            const jwtKey = config.get("jwtSecretKey");
            if(!jwtKey)
                return res.status(500).send(`jwt secret key not found!`);
            const authUser: any = jwt.verify(token, config.get("jwtSecretKey"));
            User.findById(authUser.id,(err: any, result: UserType | null) => {
                if(err)
                    return res.status(400).send(err.message);
                if(!result)
                    return res.status(404).send(`Cannot find user with ${authUser.username} username!`);
                if(result.isAdmin == true){
                    res.setHeader("Access-Control-Allow-Origin","*");
                    res.setHeader("Access-Control-Allow-Methods","*");
                    res.setHeader("Access-Control-Allow-Headers","*");
                    next();
                } else {
                    return res.status(403).send(`You cannot get this data!`);
                }
            });
        } catch(ex) {
            return res.status(400).send(ex.message);
        }
    }
}