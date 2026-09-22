import express from "express";
const router = express.Router();

import auth from "../middleware/auth.js";
import * as controllers from "../controllers/luna.controller.js";

// Public: the website widget fetches the aggregated knowledge base.
router.get("/knowledge", controllers.getKnowledge);

// Admin-only: force a rebuild from the latest CMS data.
router.post("/rebuild", auth, controllers.rebuild);

export default router;
