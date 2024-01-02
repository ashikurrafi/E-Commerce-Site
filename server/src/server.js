const app = require("./app");

const { serverPort } = require("./secret");

const connectDataBase = require("./config/db");
const logger = require("./controllers/loggerController");

app.listen(serverPort, async () => {
    logger.log("info", `Server is running ar http://localhost:${serverPort}`);
    await connectDataBase();
});
