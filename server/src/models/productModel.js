const { Schema, model } = require("mongoose");
const { defaultImagePath } = require("../secret");

const productsSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            minlength: [3, "Product name can be minimum 3 characters"],
            maxlength: [150, "Product name can be maximum 150 characters"],
        },
        slug: {
            type: String,
            required: [true, "Product name is required"],
            lowercase: true,
            unique: true,
        },
        description: {
            type: String,
            required: [true, "Product description is required"],
            trim: true,
            minlength: [3, "Product description can be minimum 3 characters"],
        },
        price: {
            type: Number,
            required: [true, "Product price is required"],
            trim: true,
            validate: {
                validator: (v) => v > 0,
                message: (props) => `${props.value} is not a valid price`,
            },
        },
        quantity: {
            type: Number,
            required: [true, "Product quantity is required"],
            trim: true,
            validate: {
                validator: (v) => v > 0,
                message: (props) => `${props.value} is not a valid number`,
            },
        },

        sold: {
            type: Number,
            required: [true, "Sold quantity is required"],
            trim: true,
            default: 0,
            validate: {
                validator: (v) => v >= 0, // Updated validation condition
                message: (props) =>
                    `${props.value} is not a valid sold quantity`,
            },
        },

        shipping: {
            type: Number,
            default: 0, // Shipping free == 0
        },
        // image: {
        //     type: Buffer,
        //     contentType: String,
        //     required: [true, "Product image is required"],
        //     // default: defaultImagePath,
        // },
        image: {
            type: String,
            default: defaultImagePath,
            required: [true, "Product image is required"],
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
    },
    { timestamps: true }
);

const Products = model("Products", productsSchema);

module.exports = Products;
