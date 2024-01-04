const slugify = require("slugify");
const Category = require("../models/categoryModel");

const createCategory = async (categoryName) => {
    const newCategory = await Category.create({
        name: categoryName,
        slug: slugify(categoryName),
    });
    return newCategory;
};

module.exports = {
    createCategory,
};
