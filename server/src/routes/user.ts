import express from "express";
import userController from "../controllers/userController";

const router = express.Router();

router.get("/:id", userController.getUser);

export default router;
