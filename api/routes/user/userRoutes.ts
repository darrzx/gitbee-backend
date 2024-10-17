import express from "express";
import UserHandler from "api/handlers/user/userHandler";

const userRoutes = express.Router();

userRoutes.get("/get-name", UserHandler.getName);

export default userRoutes;
