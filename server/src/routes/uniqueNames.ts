import express from "express";
import uniqueNameController from "../controllers/uniqueNameController";

const router = express.Router();

router.get("/:uniqueName", uniqueNameController.checkUniqueNameAvailability);
router.get(
  "/peer/:uniqueName",
  uniqueNameController.getPeerByUniqueName
);

export default router;
