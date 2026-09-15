import express from "express";
const router = express.Router();
import auth from "../middleware/auth.js";
import * as controllers from "../controllers/destination.controller.js"

router.get("/", controllers.list).post("/", auth, controllers.create)

router.get("/:slug", controllers.get).put("/:slug", auth, controllers.update).delete("/:slug", auth, controllers.deleteProperty)

export default router;
