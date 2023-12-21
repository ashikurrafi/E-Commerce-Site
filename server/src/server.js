const express = require("express");
const morgan = require("morgan");

const app = express();
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.status(200).send({
        message: "Welcome to server",
    });
});

app.get("/test", (req, res) => {
    res.send("Test API is working [GET]");
});

port = 3000;

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
