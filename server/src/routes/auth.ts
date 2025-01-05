import express from "express";
import authController from "../controllers/authController";

const router = express.Router();

router.post("/login", authController.login);
router.post("/verify", authController.verify);
router.get("/session", authController.session);
router.post("/logout", authController.logout);

export default router;
