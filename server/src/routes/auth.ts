import express from "express";
import authController from "../controllers/authController";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post("/login", authController.login);
router.post("/verify", authController.verify);
router.post(
  "/setup-account",
  upload.single("profilePicture"),
  authController.setupAccount
);
router.get("/session", authController.session);
router.post("/logout", authController.logout);

export default router;
