const createError = require("http-errors");
const { createProduct } = require("../services/productService");
const { successResponse } = require("./responseController");

const handleCreateProducts = async (req, res, next) => {
    try {
        const image = req.file?.path;

        const product = await createProduct(req.body, image);

        return successResponse(res, {
            statusCode: 200,
            message: `Product (${name}) created successfully`,
            payload: { product },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    handleCreateProducts,
};
