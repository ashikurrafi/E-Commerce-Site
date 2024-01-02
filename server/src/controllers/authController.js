const User = require("../models/userModel");
const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { successResponse } = require("./responseController");
const { createJSONWebToken } = require("../helper/jsonWebToken");
const { jwtAccessKey, jwtRefreshKey } = require("../secret");
const {
    setAccessTokenCookie,
    setRefreshTokenCookie,
} = require("../helper/cookie");

const handelLogin = async (req, res, next) => {
    try {
        // email and password form req body
        const { email, password } = req.body;
        // user exist or not
        const user = await User.findOne({ email });
        if (!user) {
            throw createError(404, "User does not exist, please register");
        }
        // compare pass
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw createError(
                401,
                "Wrong email and password, please try again"
            );
        }
        // is user banned or not ?
        if (user.isBanned) {
            throw createError(403, "User banned please contact 01719697406");
        }

        // gen token cookie
        const accessToken = createJSONWebToken({ user }, jwtAccessKey, "1m"); // 15min
        setAccessTokenCookie(res, accessToken);

        const refreshToken = createJSONWebToken({ user }, jwtRefreshKey, "7d");
        setRefreshTokenCookie(res, refreshToken);

        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        // Success response
        return successResponse(res, {
            statusCode: 200,
            message: "User logged in successfully",
            payload: { userWithoutPassword },
        });
    } catch (error) {
        next(error);
    }
};

const handelRefreshToken = async (req, res, next) => {
    try {
        const oldRefreshToken = req.cookies.refreshToken;
        // Verify old refresh token
        const decodedToken = jwt.verify(oldRefreshToken, jwtRefreshKey);
        if (!decodedToken) {
            throw createError(401, "Invalid refresh token");
        }

        const accessToken = createJSONWebToken(
            decodedToken.user,
            jwtAccessKey,
            "5m"
        );
        setAccessTokenCookie(res, accessToken);

        return successResponse(res, {
            statusCode: 200,
            message: "New access token generated",
            payload: {},
        });
    } catch (error) {
        next(error);
    }
};

const handelProtectedRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;

        const decodedToken = jwt.verify(accessToken, jwtAccessKey);
        if (!decodedToken) {
            throw createError(401, "Invalid access token");
        }

        return successResponse(res, {
            statusCode: 200,
            message: "Protected resource access successfully",
            payload: {},
        });
    } catch (error) {
        next(error);
    }
};

const handelLogout = async (req, res, next) => {
    try {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        // Success response
        return successResponse(res, {
            statusCode: 200,
            message: "User logged out successfully",
            payload: {},
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    handelLogin,
    handelRefreshToken,
    handelProtectedRoute,
    handelLogout,
};
