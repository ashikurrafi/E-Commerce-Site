const createError = require("http-errors");
const mongoose = require("mongoose");

const findWithId = async (Model, id, options = {}) => {
    try {
        const item = await Model.findById(id, options);
        if (!item) {
            throw createError(404, `${Model.modelName} not exist`);
        }
        return item;
    } catch (error) {
        if (error instanceof mongoose.Error) {
            throw createError(400, "Invalid User ID");
        }
        throw error;
    }
};

module.exports = { findWithId };
