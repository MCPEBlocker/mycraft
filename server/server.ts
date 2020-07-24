require('dotenv').config();
import express = require("express");
const app: express.Application = express();
const config: any = require("./config.json")
import mongoose = require('mongoose');
import winston = require('winston');
import authRoute from './routes/auth';
const logger: winston.Logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename:'./logs/index.log'})
    ]
});

const mongodbURI: any = process.env.mongodbURI;

mongoose.connect(mongodbURI,{
    useCreateIndex:true,
    useFindAndModify:true,
    useUnifiedTopology:true,
    useNewUrlParser:true
},(err:any) => {
    if(err)
        return logger.error('Cannot connect to the mongodb cloud!');
});

app.use('/api/auth',authRoute);

app.get("/", (req: any, res: any) => {
    res.send("/ main page");4
})

app.listen(config.port, () => {
    console.log(`Up and running on https://localhost:${config.port}`)
})