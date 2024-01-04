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

const getAllProducts = async (page = 1, limit = 4, filter = {}) => {
    const products = await Products.find(filter)
        .populate("category")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

    if (!products) {
        throw createError(404, "Products not found");
    }

    const count = await Products.find(filter).countDocuments();
    return {
        products,
        count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
    };
};

const getSingleProducts = async (slug) => {
    const product = await Products.findOne({ slug }).populate("category");

    if (!product) {
        throw createError(404, "No product found");
    }

    return product;
};

module.exports = {
    createProduct,
    getAllProducts,
    getSingleProducts,
};
