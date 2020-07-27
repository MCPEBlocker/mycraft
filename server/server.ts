require('dotenv').config();
import express = require("express");
const app: express.Application = express();
import config from 'config';
import mongoose from 'mongoose';
import winston from 'winston';
import authRoute from './routes/auth';
import photoRoute from './routes/photo';
import craftingRoute from './routes/crafting';
const logger: winston.Logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename:'./logs/index.log'})
    ]
});

const mongodbURI: any = config.get("mongodbURI");

mongoose.connect(mongodbURI,{
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology:true,
    useNewUrlParser:true
},(err:any) => {
    if(err)
        return logger.error('Cannot connect to the mongodb cloud!');
});

app.use('/api/auth',authRoute);
app.use('/api/photo',photoRoute);
app.use('/api/crafting',craftingRoute);

app.get("/", (req: express.Request, res: express.Response) => {
    res.setHeader("Content-Type","text/html");
    res.send("/ - main page<br /> /api/auth - users api<br /> /api/photo - api which working with photos<br /> /api/crafting - crafting api<br /> these are for now :)");
});

app.listen(process.env.PORT || config.get("port"), () => {
    logger.info(`Up and running on https://localhost:${process.env.PORT || config.get("port")}`);
})