const logger = require("../controllers/loggerController");

const fs = require("fs").promises;

const deleteImage = async (userImagePath) => {
    try {
        await fs.access(userImagePath);
        await fs.unlink(userImagePath);
        logger.log("info", "Image deleted");
    } catch (error) {
        logger.log("error", "Image dose not exist");
    }
};
module.exports = { deleteImage };
