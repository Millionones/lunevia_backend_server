import express from "express";
const router = express.Router();

import auth from "../middleware/auth.js";
import * as controllers from "../controllers/pageContent.controller.js";

router.get("/", controllers.list);

router.get("/:page", controllers.getByPage);

// Upsert-by-page — the CMS client posts/puts { page, content }.
router.post("/", auth, controllers.upsert);

router.put("/", auth, controllers.upsert);

router.delete("/:id", auth, controllers.remove);

export default router;
