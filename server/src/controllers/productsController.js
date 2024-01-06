const createError = require("http-errors");
const {
    createProduct,
    getAllProducts,
    getSingleProduct,
    deleteProducts,
    updateProducts,
} = require("../services/productService");
const { successResponse } = require("./responseController");

const handleCreateProducts = async (req, res, next) => {
    try {
        const image = req.file?.path;

        const product = await createProduct(req.body, image);

        return successResponse(res, {
            statusCode: 200,
            message: `Product created successfully`,
            payload: { product },
        });
    } catch (error) {
        next(error);
    }
};

const handleGetAllProducts = async (req, res, next) => {
    try {
        const search = req.query.search || "";

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;

        const searchRegExp = new RegExp(".*" + search + ".*", "i");

        const filter = {
            $or: [
                { name: { $regex: searchRegExp } },
                //     { email: { $regex: searchRegExp } },
                //     { phone: { $regex: searchRegExp } },
            ],
        };

        const productsData = await getAllProducts(page, limit, filter);

        return successResponse(res, {
            statusCode: 200,
            message: `Product returned successfully`,
            payload: {
                products: productsData.products,
                pagination: {
                    totalPages: productsData.totalPages,
                    currentPage: productsData.currentPage,
                    previousPage: productsData.currentPage - 1,
                    nextPage: productsData.currentPage + 1,
                    totalNumberOfProducts: productsData.count,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

const handleGetProduct = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const product = await getSingleProduct(slug);
        return successResponse(res, {
            statusCode: 200,
            message: `Product ${slug} returned successfully`,
            payload: { product },
        });
    } catch (error) {
        next(error);
    }
};

const handelDeleteProducts = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const product = await deleteProducts(slug);
        return successResponse(res, {
            statusCode: 200,
            message: `Product ${slug} deleted successfully`,
            payload: { product },
        });
    } catch (error) {
        next(error);
    }
};

const handelUpdateProduct = async (req, res, next) => {
    try {
        const { slug } = req.params;

        const updatedProduct = await updateProducts(slug, req);

        return successResponse(res, {
            statusCode: 200,
            message: "Product updated successfully",
            payload: updatedProduct,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    handleCreateProducts,
    handleGetAllProducts,
    handleGetProduct,
    handelDeleteProducts,
    handelUpdateProduct,
};
