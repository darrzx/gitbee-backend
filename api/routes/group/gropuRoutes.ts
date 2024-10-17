import express from "express";
import GroupHandler from "api/handlers/group/groupHandler";

const groupRoutes = express.Router();

groupRoutes.post("/insert", GroupHandler.insertTemporaryGroup);

export default groupRoutes;