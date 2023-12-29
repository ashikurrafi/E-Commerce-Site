const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const { defaultImagePath } = require("../secret");

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "User name is required"],
            trim: true,
            minlength: [3, "User name must be minimum 3 characters"],
            maxlength: [50, "User name can be maximum 50 characters"],
        },
        email: {
            type: String,
            required: [true, "User name is required"],
            trim: true,
            unique: true,
            lowercase: true,
            validate: {
                validator: function (v) {
                    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                        v
                    );
                },
                message: "Please enter a valid email",
            },
        },
        password: {
            type: String,
            required: [true, "User password is required"],
            minlength: [8, "User password must be minimum 8 characters long"],
            set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(1)),
        },
        image: {
            type: String,
            default: defaultImagePath,
            // type: Buffer,
            // contentType: String,
            // required: [true, "User image is required"],
        },
        address: {
            type: String,
            minlength: [3, "Address can be minimum 3 characters"],
            required: [true, "User address is required"],
        },
        phone: {
            type: String,
            required: [true, "User phone is required"],
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        isBanned: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const User = model("Users", userSchema);

module.exports = User;
