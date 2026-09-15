import express from "express";

const router = express.Router();

import indexRouter from "./routes/index.js";

import authRouter from "./routes/auth.router.js";

import destinationRouter from "./routes/destination.router.js";

import commonRouter from "./routes/common.router.js";

import websiteRouter from "./routes/website.router.js";

import blogRouter from "./routes/blog.router.js";

import contact from "./routes/contact.router.js";

import bookingsRouter from "./routes/bookings.router.js";

import testimonialRouter from "./routes/testimonial.router.js";

import serviceRouter from "./routes/service.router.js";

import jobPostRouter from "./routes/jobPost.router.js";

import pageContentRouter from "./routes/pageContent.router.js";

router.use("/", indexRouter);

router.use("/auth", authRouter);

router.use("/common", commonRouter);

router.use("/destination", destinationRouter);

router.use("/website", websiteRouter);

router.use("/blogs", blogRouter);

router.use("/contact", contact);

router.use("/bookings", bookingsRouter);

router.use("/testimonial", testimonialRouter);

router.use("/service", serviceRouter);

router.use("/job-post", jobPostRouter);

router.use("/page-content", pageContentRouter);

export default router;
