const multer = require("multer");
const path = require("path");
const { uploadDir, maximumFileSize, allowedFileType } = require("../secret");
const createError = require("http-errors");

const UPLOAD_DIR = uploadDir;
const maxFileSize = Number(maximumFileSize);
const allowFileType = allowedFileType;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_DIR);
    },
    filename: function (req, file, cb) {
        const extname = path.extname(file.originalname);
        cb(
            null,
            Date.now() + "-" + file.originalname.replace(extname, "") + extname
        );
    },
});

const fileFilter = (req, file, cb) => {
    const extname = path.extname(file.originalname);
    if (!allowFileType.includes(extname.substring(1))) {
        return cb(createError(400, "File type not allowed"));
    } else {
        cb(null, true);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: maxFileSize },
    fileFilter,
});
module.exports = upload;
