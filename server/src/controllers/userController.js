const createError = require("http-errors");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { mongoose } = require("mongoose");
const { findWithId } = require("../services/findItem");

const getUsers = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const searchRegularExpression = new RegExp(".*" + search + ".*", "i");

        const filter = {
            isAdmin: { $ne: true },
            $or: [
                { name: { $regex: searchRegularExpression } },
                { email: { $regex: searchRegularExpression } },
                { phone: { $regex: searchRegularExpression } },
            ],
        };

        const options = { password: 0 };

        const users = await User.find(filter, options)
            .limit(limit)
            .skip((page - 1) * limit);

        const count = await User.find(filter).countDocuments();

        if (!users) throw createError(404, "No user found");

        return successResponse(res, {
            statusCode: 200,
            message: "Users returned successfully",
            payload: {
                users,
                pagination: {
                    totalPages: Math.ceil(count / limit),
                    currentPage: page,
                    previousPage: page - 1 > 0 ? page - 1 : null,
                    nextPage:
                        page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

const getUserByID = async (req, res, next) => {
    try {
        const id = req.params.id;
        const options = { password: 0 };

        const user = await findWithId(User, id, options);
        return successResponse(res, {
            statusCode: 200,
            message: "User returned successfully",
            payload: { user },
        });
    } catch (error) {
        if (error instanceof mongoose.Error) {
            next(createError(400, "Invalid user ID"));
            return;
        }
        next(error);
    }
};

module.exports = {
    getUsers,
    getUserByID,
};
