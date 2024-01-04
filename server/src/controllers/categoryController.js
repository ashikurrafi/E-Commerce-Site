const slugify = require("slugify");
const { successResponse } = require("../controllers/responseController");
const Category = require("../models/categoryModel");
const { createCategory } = require("../services/categoryService");

const handelCreateCategory = async (req, res, next) => {
    try {
        const { name } = req.body;

        await createCategory(name);

        return successResponse(res, {
            statusCode: 201,
            message: `Category '${name}' created successfully`,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    handelCreateCategory,
};
