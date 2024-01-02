require("dotenv").config();

const serverPort = process.env.SERVER_PORT || 3002;
const mongodbURL = process.env.MONGODB_URL;
const defaultImagePath = process.env.DEFAULT_USER_IMAGE_PATH;
const jwtActivationKey = process.env.JWT_SECRET_KEY;
const smtpUsername = process.env.SMTP_USERNAME;
const smtpPassword = process.env.SMTP_PASSWORD;
const clientURL = process.env.CLIENT_URL;
const uploadDir = process.env.UPLOAD_DIRECTORY;
const maximumFileSize = process.env.MAX_FILE_SIZE;
const allowedFileType = process.env.ALLOWED_FILE_TYPE;
const jwtAccessKey = process.env.JWT_ACCESS_KEY;
const jwtResetPasswordKey = process.env.JWT_RESET_PASSWORD_KEY;
const jwtRefreshKey = process.env.JWT_REFRESH_KEY;

module.exports = {
    serverPort,
    mongodbURL,
    defaultImagePath,
    jwtActivationKey,
    smtpUsername,
    smtpPassword,
    clientURL,
    uploadDir,
    maximumFileSize,
    allowedFileType,
    jwtAccessKey,
    jwtResetPasswordKey,
    jwtRefreshKey,
};
