const slugify = require("slugify");
const { successResponse } = require("../controllers/responseController");
const Category = require("../models/categoryModel");
const {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
} = require("../services/categoryService");
const createError = require("http-errors");

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

const handelGetCategories = async (req, res, next) => {
    try {
        const categories = await getCategories();
        if (!categories) {
            throw createError(404, "Categories not found");
        }
        return successResponse(res, {
            statusCode: 200,
            message: `Category returned successfully`,
            payload: categories,
        });
    } catch (error) {
        next(error);
    }
};

const handelGetCategory = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const category = await getCategory(slug);

        if (!category) {
            throw createError(404, "Category not found");
        }

        return successResponse(res, {
            statusCode: 200,
            message: `Category returned successfully`,
            payload: { category },
        });
    } catch (error) {
        next(error);
    }
};

const handelUpdateCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        const { slug } = req.params;
        const UpdatedCategory = await updateCategory(name, slug);

        if (!UpdatedCategory) {
            throw createError(404, "Category not found");
        }

        return successResponse(res, {
            statusCode: 200,
            message: `Category updated successfully`,
            payload: { UpdatedCategory },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    handelCreateCategory,
    handelGetCategories,
    handelGetCategory,
    handelUpdateCategory,
};
