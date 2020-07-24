import express = require("express");

const config: any = require("./config.json")

const app: express.Application = express();

app.get("/", (req: any, res: any) => {
    res.send("/ main page");
})

app.listen(config.port, () => {
    console.log(`Up and running on https://localhost:${config.port}`)
})