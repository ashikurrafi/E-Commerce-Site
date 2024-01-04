const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Category name required"],
            trim: true,
            unique: true,
            minlength: [3, "Category name must be at least 3 characters long"],
        },
        slug: {
            type: String,
            required: [true, "Category slug is required"],
            lowercase: true,
            unique: true,
        },
    },
    { timestamps: true }
);

const Category = model("Category", categorySchema);
module.exports = Category;
