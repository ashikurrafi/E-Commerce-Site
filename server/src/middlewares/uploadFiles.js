const multer = require("multer");
const {
    UPLOAD_DIRECTORY,
    MAX_FILE_SIZE,
    ALLOWED_FILE_TYPE,
} = require("../config");

const userStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_DIRECTORY);
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

module.exports = uploadUserImage;

// const storage = multer.diskStorage();

// const fileFilter = (req, file, cb) => {
//     if (!file.mimetype.startsWith("image/")) {
//         return cb(new Error("Only image are allowed"), false);
//     }
//     if (file.size > MAX_FILE_SIZE) {
//         return cb(
//             new Error("Image size exceed maximum limit (Max 2 MB)"),
//             false
//         );
//     }
//     if (!ALLOWED_FILE_TYPE.includes(file.mimetype)) {
//         return cb(new Error("Image type is not allowed"), false);
//     }
//     cb(null, true);
// };

// const upload = multer({
//     storage: storage,
//     fileFilter: fileFilter,
// });
// module.exports = upload;
