require("dotenv").config();

const serverPort = process.env.SERVER_PORT || 3002;
const mongodbURL = process.env.MONGODB_URL;
const defaultImagePath = process.env.DEFAULT_USER_IMAGE_PATH;

module.exports = {
    serverPort,
    mongodbURL,
    defaultImagePath,
};
