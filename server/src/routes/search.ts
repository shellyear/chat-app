import express from "express";
import searchController from "../controllers/searchController";

const router = express.Router();

router.get("/users", searchController.searchUsers);

export default router;
