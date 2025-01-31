import express from "express";
import userController from "../controllers/userController";

const router = express.Router();

router.get("/:id", userController.findUser);
router.post("/:id/profile", userController.setProfileInfo);

export default router;
