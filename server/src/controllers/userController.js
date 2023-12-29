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
const path = require("path");

const handelGetUsers = async (req, res, next) => {
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

const handelGetUserByID = async (req, res, next) => {
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

const handelDeleteUserByID = async (req, res, next) => {
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

const handelProcessRegister = async (req, res, next) => {
    try {
        const { name, email, password, phone, address } = req.body;

        const image = req.file?.path;

        if (image && image.size > 1024 * 10242) {
            throw createError(400, "File size too big, maximum size is 2 MB");
        }

        const userExist = await User.exists({ email: email });

        if (userExist) {
            throw createError(
                409,
                "User with this email already exist, please login"
            );
        }

        const tokenPayloadData = {
            name,
            email,
            password,
            phone,
            address,
            image: image,
        };
        if (image) {
            tokenPayloadData.image = image;
        }
        const token = createJSONWebToken(
            tokenPayloadData,
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

const handelActivateUserAccount = async (req, res, next) => {
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

const handelUpdateUserById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const options = { password: 0 };
        const user = await findWithId(User, userId, options);
        const updateOptions = {
            new: true,
            runValidators: true,
            context: "query",
        };

        let updates = {};

        const allowedFields = ["name", "password", "phone", "address"];

        for (const key in req.body) {
            if (allowedFields.includes(key)) {
                updates[key] = req.body[key];
            } else if (key === "email") {
                throw createError(400, "Email can't be updated");
            }
        }

        const image = req.file?.path;
        if (image) {
            if (image.size > 1024 * 1024 * 2) {
                throw createError(400, "Image is more than 2 MB");
            }
            updates.image = image;
            user.image !== "default.png" && deleteImage(user.image);
        }

        // delete updates.email;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates,
            updateOptions
        ).select("-password");

        if (!updatedUser) {
            throw createError(404, "User with this ID not exist");
        }

        return successResponse(res, {
            statusCode: 200,
            message: "User updated successfully",
            payload: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};

const handelBanUserById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        await findWithId(User, userId);
        const updates = { isBanned: true };
        const updateOptions = {
            new: true,
            runValidators: true,
            context: "query",
        };
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates, // {isBanned:true}
            updateOptions
        ).select("-password");

        if (!updatedUser) {
            throw createError(400, "User not banned successfully");
        }

        return successResponse(res, {
            statusCode: 200,
            message: "User banned successfully",
        });
    } catch (error) {
        next(error);
    }
};

const handelUnbanUserById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        await findWithId(User, userId);
        const updates = { isBanned: false };
        const updateOptions = {
            new: true,
            runValidators: true,
            context: "query",
        };
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates, // {isBanned:false}
            updateOptions
        ).select("-password");

        if (!updatedUser) {
            throw createError(400, "User not unbanned successfully");
        }

        return successResponse(res, {
            statusCode: 200,
            message: "User unbanned successfully",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    handelGetUsers,
    handelGetUserByID,
    handelDeleteUserByID,
    handelProcessRegister,
    handelActivateUserAccount,
    handelUpdateUserById,
    handelBanUserById,
    handelUnbanUserById,
};
