const mongoose = require("mongoose");
const { mongodbURL } = require("../secret");
const logger = require("../controllers/loggerController");

const connectDataBase = async (options = {}) => {
    try {
        await mongoose.connect(mongodbURL, options);
        logger.log("info", "Connected to MongoDB successfully");
        logger.log("info", `Connected to ${mongodbURL}`);
        mongoose.connection.on("error", (error) => {
            logger.error("error", "DB connection error : ", error);
        });
    } catch (error) {
        logger.error("error", "Can't connect to DB : ", error.toString());
    }
};

module.exports = connectDataBase;
