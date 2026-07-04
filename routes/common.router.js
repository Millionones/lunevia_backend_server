import express from "express";
const router = express.Router();

import * as controllers from "../controllers/common.controller.js";

import { imageFileName, multerUpload } from "../helper/functions.js";

import auth from "../middleware/auth.js";

router.get("/feature-options", controllers.getFeatureOptions)

router.post("/feature-options", controllers.addFeatureOptions)

router.get("/property-highlights", controllers.getPropertyHighlights)

router.post("/property-highlights", controllers.addPropertyHighlights)

router.get("/gallery-images", controllers.getGalleryImages)

router.use(auth);

router.post(
  "/image/:folder",
  (req, res, next) => {
    const upload = multerUpload(req.params.folder, null, { fileSize: 5 * 4000 * 4000 });
    upload.single("file")(req, res, next);
  },
  imageFileName
);

router.delete("/image", controllers.deleteImage);

export default router;