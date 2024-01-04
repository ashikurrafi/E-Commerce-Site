const express = require("express");
const { uploadProductImage } = require("../middlewares/uploadFiles");
const { validateProduct } = require("../validators/product");
const runValidation = require("../validators");
const { handleCreateProducts } = require("../controllers/productsController");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");

const productRouter = express.Router();

// /api/products

productRouter.post(
    "/",
    uploadProductImage.single("image"),
    validateProduct,
    runValidation,
    isLoggedIn,
    isAdmin,
    handleCreateProducts
);

module.exports = productRouter;
