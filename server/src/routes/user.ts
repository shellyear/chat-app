import express from "express";
import multer from "multer";
import userController from "../controllers/userController";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.get("/:id", userController.findUser);
router.post(
  "/:id/profile",
  upload.single("profilePicture"),
  userController.setProfileInfo
);

export default router;
