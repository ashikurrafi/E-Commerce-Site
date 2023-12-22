const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const { errorResponse } = require("./controllers/responseController");

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.status(200).send({
        message: "Welcome to server",
    });
});

app.get("/test", (req, res) => {
    res.send("Test API is working [GET]");
});

port = 3000;

// Client error handling
app.use((req, res, next) => {
    next(createError(404, "Route not found"));
});

// Server error handling -> all the error
app.use((err, req, res, next) => {
    return errorResponse(res, { statusCode: err.status, message: err.message });
});

module.exports = app;
