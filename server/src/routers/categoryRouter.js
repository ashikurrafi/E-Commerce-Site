const express = require("express");
const {
    handelCreateCategory,
    handelGetCategories,
    handelGetCategory,
    handelUpdateCategory,
} = require("../controllers/categoryController");
const { validateCategory } = require("../validators/category");
const runValidation = require("../validators");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");

const categoryRouter = express.Router();

categoryRouter.post(
    "/",
    validateCategory,
    runValidation,
    isLoggedIn,
    isAdmin,
    handelCreateCategory
);

categoryRouter.get("/", handelGetCategories);
categoryRouter.get("/:slug", handelGetCategory);
categoryRouter.put("/:slug", handelUpdateCategory);

module.exports = categoryRouter;
