const slugify = require("slugify");
const Products = require("../models/productModel");
const createError = require("http-errors");
const { deleteImage } = require("../helper/deleteImage");

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

const getSingleProduct = async (slug) => {
    const product = await Products.findOne({ slug }).populate("category");

    if (!product) {
        throw createError(404, "No product found");
    }

    return product;
};

const deleteProducts = async (slug) => {
    const product = await Products.findOneAndDelete({ slug });

    if (!product) {
        throw createError(404, "No product found");
    }

    if (product.image) {
        await deleteImage(product.image);
    }
    return product;
};

const updateProducts = async (slug, req) => {
    try {
        const product = await Products.findOne({ slug: slug });
        if (!product) {
            throw createError(404, "No product found");
        }

        const updateOptions = {
            new: true,
            runValidators: true,
            context: "query",
        };

        let updates = {};

        const allowedFields = [
            "name",
            "description",
            "price",
            "sold",
            "quantity",
            "shipping",
        ];

        for (const key in req.body) {
            if (allowedFields.includes(key)) {
                if (key === "name") {
                    updates.slug = slugify(req.body[key]);
                }

                updates[key] = req.body[key];
            }
        }

        const image = req.file?.path;
        if (image) {
            if (image.size > 1024 * 1024 * 2) {
                throw new Error("file is too big, must less than 2MB");
            }
            updates.image = image;
            product.image !== "default.png" && deleteImage(product.image);
        }

        const updatedProduct = await Products.findOneAndUpdate(
            { slug },
            updates,
            updateOptions
        );

        if (!updatedProduct) {
            throw createError(404, "Can't update product");
        }
        return updatedProduct;
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    deleteProducts,
    updateProducts,
};
