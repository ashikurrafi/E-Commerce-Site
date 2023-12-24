const data = require("../data");
const User = require("../models/userModel");

const seedUser = async (req, res, next) => {
    try {
        // Delete all existing users
        await User.deleteMany({});

        // Insert new user data
        const users = await User.insertMany(data.users);

        // Successful response
        return res.status(200).json(users);
    } catch (error) {
        console.log("Error seeding data:", error);
        next(error);
    }
};

module.exports = { seedUser };
