import express from "express";
const router = express.Router();

import { imageFileName, multerUpload } from "../helper/functions.js";
import * as controllers from "../controllers/blog.controller.js";

import auth from "../middleware/auth.js";

router.get("/", controllers.list).post("/", auth, controllers.create);

router.get("/:slug", controllers.getDetails).put("/:slug", auth, controllers.update).delete("/:slug", auth, controllers.deleteBlog);



export default router;
