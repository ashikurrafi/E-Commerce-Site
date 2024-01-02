const createError = require("http-errors");
const User = require("../models/userModel");
const { deleteImage } = require("../helper/deleteImage");
const mongoose = require("mongoose");
const findWithId = require("../services/findItem");
const bcrypt = require("bcryptjs");
const { clientURL, jwtResetPasswordKey } = require("../secret");
const { createJSONWebToken } = require("../helper/jsonWebToken");
const jwt = require("jsonwebtoken");
const sendEmail = require("../helper/sendEmail");

const findUsers = async (search, limit, page) => {
    try {
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

        if (!users || users.length == 0)
            throw createError(404, "User not found");
        return {
            users,
            pagination: {
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                previousPage: page - 1 > 0 ? page - 1 : null,
                nextPage:
                    page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
            },
        };
    } catch (error) {
        throw error;
    }
};

const fineUserById = async (id, options = {}) => {
    try {
        const user = await User.findById(id, options);
        if (!user) throw createError(404, "User not found");
        return user;
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw createError(404, "Invalid ID");
        }
        throw error;
    }
};

const deleteUserById = async (id, options = {}) => {
    try {
        const user = await User.findByIdAndDelete({
            _id: id,
            isAdmin: false,
        });

        if (!user) {
            throw createError(404, "User with this ID is not found");
        }

        const userImagePath = user.image;
        if (userImagePath) {
            await deleteImage(userImagePath);
        }
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw createError(404, "Invalid ID");
        }
        throw error;
    }
};

const updateUserById = async (userId, req) => {
    try {
        const options = { password: 0 };
        const user = await fineUserById(userId, options);
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
                throw createError(400, "Email is not allowed to update");
            }
        }

        const image = req.file?.path;
        if (image) {
            if (image.size > 1024 * 1024 * 2) {
                throw createError(400, "Image size must be less than 2MB");
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

        return updatedUser;
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw createError(404, "Invalid ID");
        }
        throw error;
    }
};

const updateUserPasswordById = async (
    userId,
    email,
    oldPassword,
    newPassword,
    confirmPassword
) => {
    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            throw createError(404, "User not found");
        }

        if (newPassword !== confirmPassword) {
            throw createError(
                400,
                "New password and Confirm password must be same, they didn't match"
            );
        }

        // compare pass
        const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            user.password
        );
        if (!isPasswordMatch) {
            throw createError(400, "Old password is incorrect");
        }

        const updates = { $set: { password: newPassword } };
        const updateOptions = { new: true };

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates, // { password: newPassword }
            updateOptions // { new: true }
        ).select("-password");

        if (!updatedUser) {
            throw createError(400, "Password not updated");
        }
        return updatedUser;
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw createError(404, "Invalid ID");
        }
        throw error;
    }
};

const forgetUserPasswordByEmail = async (email) => {
    try {
        const userData = await User.findOne({ email: email });
        if (!userData) {
            throw createError(404, "User not found, Please register");
        }

        const token = createJSONWebToken({ email }, jwtResetPasswordKey, "10m");

        const emailData = {
            email,
            subject: "Password reset email",
            html: `<h2>Hello ${userData.name}</h2>
            <p>Here is your password reset email, please click here to <a href="${clientURL}/api/users/reset-password/${token}" target="_blank">Reset password</a></p>`,
        };
        //Send mail
        sendEmail(emailData);
    } catch (error) {
        throw error;
    }
};

const resetUserPassword = async (token, password) => {
    try {
        const decoded = jwt.verify(token, jwtResetPasswordKey);

        if (!decoded) {
            throw createError(400, "Invalid or expired token");
        }

        const filter = { email: decoded.email };
        const update = { password: password };
        const options = { new: true };

        const updatedUser = await User.findOneAndUpdate(
            filter,
            update, // { password: password }
            options // { new: true }
        ).select("-password");

        if (!updatedUser) {
            throw createError(400, "Password reset failed");
        }
    } catch (error) {
        throw error;
    }
};

const handleUserAction = async (userId, action) => {
    try {
        let updates;
        let successMessage;
        if (action == "ban") {
            updates = { isBanned: true };
            successMessage = "User Banned successfully";
        } else if (action == "unban") {
            updates = { isBanned: false };
            successMessage = "User Unbanned successfully";
        } else {
            throw createError(400, "Invalid action");
        }

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
        return successMessage;
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw createError(404, "Invalid ID");
        }
        throw error;
    }
};

module.exports = {
    handleUserAction,
    findUsers,
    fineUserById,
    deleteUserById,
    updateUserById,
    updateUserPasswordById,
    forgetUserPasswordByEmail,
    resetUserPassword,
};
