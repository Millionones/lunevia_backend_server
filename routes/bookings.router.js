import express from "express";

import auth from "../middleware/auth.js";

import * as controller from "../controllers/bookings.controller.js";

const router = express.Router();

// Bookings contain customer PII — protect both the list and the status update.
router.get("/", auth, controller.list)

router.put("/:id", auth, controller.update)

export default router;
