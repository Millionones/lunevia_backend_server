import express from "express";
const router = express.Router();

import * as controllers from "../controllers/website.controller.js"

router.get("/destination", controllers.getWebsiteList)

router.get("/destination/:slug", controllers.getDetails)

router.get("/room/details", controllers.getRoomDetails)

router.post("/bookings", controllers.addBookings)

router.get("/blogs", controllers.getBlogList)

router.get("/blogs/:slug", controllers.getBlogDetails)

router.get("/page/:page", controllers.getPageContent)


export default router;
