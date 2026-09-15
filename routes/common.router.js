import express from "express";
const router = express.Router();

import * as controllers from "../controllers/common.controller.js";

import { imageFileName, multerUpload } from "../helper/functions.js";

import auth from "../middleware/auth.js";

// Public reads
router.get("/feature-options", controllers.getFeatureOptions);

router.get("/property-highlights", controllers.getPropertyHighlights);

router.get("/gallery-images", controllers.getGalleryImages);

router.get("/category", controllers.getCategory);

// Everything below requires an authenticated admin session.
router.use(auth);

router.post("/feature-options", controllers.addFeatureOptions);

router.post("/property-highlights", controllers.addPropertyHighlights);

router.post("/category", controllers.addCategory);

router.post(
  "/image/:folder",
  (req, res, next) => {
    const upload = multerUpload(req.params.folder, null, { fileSize: 5 * 4000 * 4000 });
    // CMS uploads under either "file" (blogs/destinations) or "image"
    // (testimonial/service) — accept both.
    upload.fields([
      { name: "file", maxCount: 1 },
      { name: "image", maxCount: 1 },
    ])(req, res, next);
  },
  imageFileName
);

router.delete("/image", controllers.deleteImage);

export default router;
