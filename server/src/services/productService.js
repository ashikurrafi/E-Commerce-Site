const slugify = require("slugify");
const Products = require("../models/productModel");
const createError = require("http-errors");

const createProduct = async (productData, image) => {
    console.log(productData);
    console.log(image);

    if (image && image.size > 1024 * 1024 * 2) {
        throw createError(400, "File size must be less than 2MB");
    }

    if (image) {
        productData.image = image;
    }

    const productsExist = await Products.exists({ name: productData.name });

    if (productsExist) {
        throw createError(409, "Product already exist, please update");
    }

    const products = await Products.create({
        ...productData,
        slug: slugify(productData.name),
    });
    return products;
};

module.exports = {
    createProduct,
};
