require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
const winston = require('winston');
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename:'./logs/index.log'})
    ]
});
const authRoute = require('./routes/auth');

mongoose.connect(process.env.mongodbURI,{
    useNewUrlParser:true,
    useFindAndModify:true,
    useUnifiedTopology:true
},(err)=>{
    if(err)
    return logger.error(`Can't connect to mongodb cloud!`);
});

app.use('/api/auth',authRoute);

app.listen(port,()=> logger.info(`Listening at port ${port}!`));