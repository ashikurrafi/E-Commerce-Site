const multer = require("multer");
const {
    UPLOAD_USER_IMAGE_DIRECTORY,
    MAX_FILE_SIZE,
    ALLOWED_FILE_TYPE,
    UPLOAD_PRODUCT_IMAGE_DIRECTORY,
} = require("../config");

const userStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_USER_IMAGE_DIRECTORY);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const productStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_PRODUCT_IMAGE_DIRECTORY);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (!ALLOWED_FILE_TYPE.includes(file.mimetype)) {
        return cb(new Error("File type is now allowed"), false);
    }
    cb(null, true);
};

const uploadUserImage = multer({
    storage: userStorage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: fileFilter,
});

const uploadProductImage = multer({
    storage: productStorage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: fileFilter,
});

module.exports = { uploadUserImage, uploadProductImage };
