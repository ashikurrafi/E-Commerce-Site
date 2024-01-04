const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const { errorResponse } = require("./controllers/responseController");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
const userRouter = require("./routers/userRouter");
const seedRouter = require("./routers/seedRouter");
const authRouter = require("./routers/authRouter");
const categoryRouter = require("./routers/categoryRouter");
const productRouter = require("./routers/productRouter");

const app = express();

const rateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 min
    max: 10,
    message: "Too many request, Please try again later",
});

app.use(cookieParser());
app.use(xssClean());
app.use(rateLimiter);
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/seed", seedRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);

app.get("/test", (req, res) => {
    res.send("Test API is working [GET]");
});

// Client error handling
app.use((req, res, next) => {
    next(createError(404, "Route not found"));
});

// Server error handling -> all the error
app.use((err, req, res, next) => {
    return errorResponse(res, { statusCode: err.status, message: err.message });
});

module.exports = app;
