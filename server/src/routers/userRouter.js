const express = require("express");
const {
    getUsers,
    getUserByID,
    deleteUserByID,
    processRegister,
} = require("../controllers/userController");

const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.get("/:id", getUserByID);
userRouter.delete("/:id", deleteUserByID);
userRouter.post("/process-register", processRegister);

module.exports = userRouter;
