import express from "express";
import searchController from "../controllers/searchController";

const router = express.Router();

router.get("/uniqueNames", searchController.searchUniqueNames);

export default router;
