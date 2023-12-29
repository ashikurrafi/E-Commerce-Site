const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { jwtAccessKey } = require("../secret");

const isLoggedIn = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        console.log("info", accessToken);
        if (!accessToken) {
            throw createError(401, "Access token not found, please login");
        }
        const decoded = jwt.verify(accessToken, jwtAccessKey);
        if (!decoded) {
            throw createError(401, "Invalid access token");
        }
        // req.body.userId = decoded._id;

        req.user = decoded.user;
        console.log("info", decoded);
        next();
    } catch (error) {
        return next(error);
    }
};

const isLoggedOut = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        console.log("info", accessToken);
        if (accessToken) {
            try {
                const decoded = jwt.verify(accessToken, jwtAccessKey);
                if (decoded) {
                    throw createError(400, "User is already logged in");
                }
            } catch (error) {
                throw error;
            }
        }
        next();
    } catch (error) {
        return next(error);
    }
};

const isAdmin = async (req, res, next) => {
    try {
        console.log("info", "User : ", req.user.isAdmin);
        if (!req.user.isAdmin) {
            throw createError(403, "Forbidden, you must be an admin to access");
        }
        next();
    } catch (error) {
        return next(error);
    }
};

module.exports = { isLoggedIn, isLoggedOut, isAdmin };
