import express = require("express");
import authRoute from './routes/auth';

const config: any = require("./config.json")

const app: express.Application = express();

app.use('/api/auth',authRoute);

app.get("/", (req: any, res: any) => {
    res.send("/ main page");
})

app.listen(config.port, () => {
    console.log(`Up and running on https://localhost:${config.port}`)
})