const data = require("../data");
const User = require("../models/userModel");
const Products = require("../models/productModel");
const logger = require("./loggerController");

const seedUser = async (req, res, next) => {
    try {
        // Delete all existing users
        await User.deleteMany({});

        // Insert new user data
        const users = await User.insertMany(data.users);

        // Successful response
        return res.status(200).json(users);
    } catch (error) {
        logger.log("error", "Error seeding data:", error);
        next(error);
    }
};

const seedProducts = async (req, res, next) => {
    try {
        // Delete all existing users
        await Products.deleteMany({});

        // Insert new user data
        const products = await Products.insertMany(data.products);

        // Successful response
        return res.status(200).json(products);
    } catch (error) {
        logger.log("error", "Error seeding data:", error);

        next(error);
    }
};

module.exports = { seedUser, seedProducts };
