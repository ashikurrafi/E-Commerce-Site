const app = require("./app");

const { serverPort } = require("./secret");

const connectDataBase = require("./config/db");

app.listen(serverPort, async () => {
    console.log("info", `Server is running ar http://localhost:${serverPort}`);
    await connectDataBase();
});
