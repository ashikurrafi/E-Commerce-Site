const express = require("express");
const { uploadProductImage } = require("../middlewares/uploadFiles");
const { validateProduct } = require("../validators/product");
const runValidation = require("../validators");
const {
    handleCreateProducts,
    handleGetAllProducts,
    handleGetProduct,
    handelDeleteProducts,
    handelUpdateProduct,
} = require("../controllers/productsController");
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
productRouter.get("/", handleGetAllProducts);
productRouter.get("/:slug", handleGetProduct);
productRouter.delete("/:slug", isLoggedIn, isAdmin, handelDeleteProducts);
productRouter.put(
    "/:slug",
    uploadProductImage.single("image"),
    isLoggedIn,
    isAdmin,
    handelUpdateProduct
);
module.exports = productRouter;
