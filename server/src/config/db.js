const mongoose = require("mongoose");
const { mongodbURL } = require("../secret");

const connectDataBase = async (options = {}) => {
    try {
        await mongoose.connect(mongodbURL, options);
        console.log("info", "Connected to DB successfully");
        console.log("info", `Connected to ${mongodbURL}`);
        mongoose.connection.on("error", (error) => {
            console.error("error", "DB connection error : ", error);
        });
    } catch (error) {
        console.error("error", "Can't connect to DB : ", error.toString());
    }
};

module.exports = connectDataBase;
