const createError = require("http-errors");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { mongoose } = require("mongoose");
const { findWithId } = require("../services/findItem");
const { deleteImage } = require("../helper/deleteImage");
const { jwtActivationKey, clientURL } = require("../secret");
const { createJSONWebToken } = require("../helper/jsonWebToken");
const emailWithNodeMailer = require("../helper/email");
const jwt = require("jsonwebtoken");

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

const deleteUserByID = async (req, res, next) => {
    try {
        const id = req.params.id;
        const options = { password: 0 };
        const user = await findWithId(User, id, options);

        const userImagePath = user.image;

        deleteImage(userImagePath);

        await User.findByIdAndDelete({
            _id: id,
            isAdmin: false,
        });

        return successResponse(res, {
            statusCode: 200,
            message: "User delete successfully",
        });
    } catch (error) {
        if (error instanceof mongoose.Error) {
            next(createError(400, "Invalid user ID"));
            return;
        }
        next(error);
    }
};

const processRegister = async (req, res, next) => {
    try {
        const { name, email, password, phone, address } = req.body;

        const userExist = await User.exists({ email: email });
        if (userExist) {
            throw createError(
                409,
                "User with this email already exist, please login"
            );
        }

        const token = createJSONWebToken(
            {
                name,
                email,
                password,
                phone,
                address,
            },
            jwtActivationKey,
            "10m"
        );

        // Create email
        const emailData = {
            email,
            subject: "Account Activation Email",
            html: `<h2>Hello ${name},<br><p>Please click <a href="${clientURL}/api/users/activate/${token}" target="_blank">here</a> to active your account.</p></h2>`,
        };

        // Send email
        try {
            // await emailWithNodeMailer(emailData);
        } catch (emailError) {
            next(createError(500, "Failed to send verification email"));
        }

        const newUser = {
            name,
            email,
            password,
            phone,
            address,
        };
        return successResponse(res, {
            statusCode: 200,
            message: `Check ${email} for activating account`,
            payload: {
                token,
            },
        });
    } catch (error) {
        if (error instanceof mongoose.Error) {
            next(createError(400, "Invalid user ID"));
            return;
        }
        next(error);
    }
};

const activateUserAccount = async (req, res, next) => {
    try {
        const token = req.body.token;
        if (!token) {
            throw createError(404, "Token not found");
        }
        try {
            const decoded = jwt.verify(token, jwtActivationKey);
            if (!decoded) {
                throw createError(401, "Unable to verify");
            }
            const userExist = await User.exists({ email: decoded.email });
            if (userExist) {
                throw createError(409, "User already exist, please login");
            }
            await User.create(decoded);
            return successResponse(res, {
                statusCode: 201,
                message: `User register successfully`,
            });
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                throw createError(401, "Token has expired");
            } else if (error.name === "JsonWebTokenError") {
                throw createError(401, "Invalid token");
            } else {
                throw error;
            }
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUsers,
    getUserByID,
    deleteUserByID,
    processRegister,
    activateUserAccount,
};
