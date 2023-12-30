const createError = require("http-errors");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { mongoose } = require("mongoose");
const { findWithId } = require("../services/findItem");
const {
    jwtActivationKey,
    clientURL,
    jwtResetPasswordKey,
} = require("../secret");
const { createJSONWebToken } = require("../helper/jsonWebToken");
const emailWithNodeMailer = require("../helper/email");
const jwt = require("jsonwebtoken");
const path = require("path");
const bcrypt = require("bcryptjs");
const {
    handelUserAction,
    findUsers,
    fineUserById,
    deleteUserById,
    updateUserById,
    updateUserPasswordById,
    forgetUserPasswordByEmail,
} = require("../services/userService");

const handelGetUsers = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const { users, pagination } = await findUsers(search, limit, page);

        return successResponse(res, {
            statusCode: 200,
            message: "Users returned successfully",
            payload: {
                users,
                pagination,
                // users: users,
                // pagination: pagination,
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

        const user = await fineUserById(id, options);
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

        await deleteUserById(id, options);

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

        if (image && image.size > 1024 * 1024) {
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

        const updatedUser = await updateUserById(userId, req);
        return successResponse(res, {
            statusCode: 200,
            message: "User updated successfully",
            payload: updatedUser,
        });
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw createError(404, "Invalid ID");
        }
        next(error);
    }
};

const handelManageUserStatusById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const action = req.body.action;

        const successMessage = await handelUserAction(userId, action);

        return successResponse(res, {
            statusCode: 200,
            message: successMessage,
        });
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw createError(404, "Invalid ID");
        }
        next(error);
    }
};

const handelUpdatePassword = async (req, res, next) => {
    try {
        const { email, oldPassword, newPassword, confirmPassword } = req.body;
        const userId = req.params.id;

        const updatedUser = await updateUserPasswordById(
            userId,
            email,
            oldPassword,
            newPassword,
            confirmPassword
        );

        return successResponse(res, {
            statusCode: 200,
            message: "Password updated successfully",
            payload: { updatedUser },
        });
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw createError(404, "Invalid ID");
        }
        next(error);
    }
};

const handelForgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const token = await forgetUserPasswordByEmail(email);

        return successResponse(res, {
            statusCode: 200,
            message: `Please check ${email} for reset password`,
            payload: { token },
        });
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw createError(404, "Invalid ID");
        }
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
    handelManageUserStatusById,
    handelUpdatePassword,
    handelForgetPassword,
};
