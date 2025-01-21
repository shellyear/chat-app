import express from "express";
import contactController from "../controllers/contactController";
import sessionMiddleware from "../middlewares/session";

const router = express.Router();

router.post("/", sessionMiddleware, contactController.addContact);
router.get("/", sessionMiddleware, contactController.getContacts);
router.get("/:id", sessionMiddleware, contactController.getContact);
router.delete("/:id", sessionMiddleware, contactController.deleteContact);

export default router;
