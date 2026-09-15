import express from "express";
const router = express.Router();

import auth from "../middleware/auth.js";
import * as controllers from "../controllers/testimonial.controller.js";

router.get("/", controllers.list);

router.post("/", auth, controllers.create);

// PUT id lives in the body (no :id param) to match the CMS client.
router.put("/", auth, controllers.update);

router.delete("/:id", auth, controllers.remove);

export default router;
