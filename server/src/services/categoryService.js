const slugify = require("slugify");
const Category = require("../models/categoryModel");

const createCategory = async (categoryName) => {
    const newCategory = await Category.create({
        name: categoryName,
        slug: slugify(categoryName),
    });
    return newCategory;
};

const getCategories = async () => {
    return await Category.find({}).select("name slug").lean();
};

const getCategory = async (slug) => {
    return await Category.find({ slug }).select("name slug").lean();
};

module.exports = {
    createCategory,
    getCategories,
    getCategory,
};
