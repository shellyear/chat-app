import express from "express";
import peerController from "../controllers/peerController";

const router = express.Router();

router.get("/:id", peerController.getPeerById);

export default router;
