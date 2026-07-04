import { asyncErrorHandler, Error, Response } from "express-error-catcher";
import model from "../model/index.js";
import fs from "fs";
import { promisify } from "util";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const accessAsync = promisify(fs.access);

export const deleteImage = asyncErrorHandler(async (req) => {
  try {
    let { path: pathName } = req.query;

    if (!pathName) throw new Error("Path is required");

    pathName = path.join(__dirname, "../public", pathName);

    console.log(pathName);

    // Use promisified access
    await accessAsync(pathName);

    // Optionally delete the file
    await promisify(fs.unlink)(pathName);

    return new Response("Deleted successfully", null, 200);
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error("File not found", 404);
    } else throw new Error(error.message || "Failed to delete image");
  }
});

export const getFeatureOptions = asyncErrorHandler(async (req) => {
  try {

    const data = await model.FeatureOptions.find({

      status: 0

    }).sort({ order: 1 });

    return new Response(null, { data }, 200);

  } catch (error) {

    throw new Error(error.message);

  }
})

export const addFeatureOptions = asyncErrorHandler(async (req) => {
  try {

    const { name } = req.body

    const exists = await model.FeatureOptions.findOne({ name });

    if (exists) throw new Error(`${exists.name} already exists`, 400);

    const data = await model.FeatureOptions({ name }).save()

    return new Response(`Option added successfully`, { data }, 200);

  } catch (error) {

    throw new Error(error.message);

  }
})

export const getPropertyHighlights = asyncErrorHandler(async (req) => {
  try {

    const data = await model.propertyHiglights.find({

      status: 0

    }).sort({ order: 1 });

    return new Response(null, { data }, 200);

  } catch (error) {

    throw new Error(error.message);

  }
})

export const addPropertyHighlights = asyncErrorHandler(async (req) => {
  try {

    const { name } = req.body

    const exists = await model.propertyHiglights.findOne({ name });

    if (exists) throw new Error(`${exists.name} already exists`, 400);

    const data = await model.propertyHiglights({ name }).save()

    return new Response(`Option added successfully`, { data }, 200);

  } catch (error) {

    throw new Error(error.message);

  }
})

export const getGalleryImages = asyncErrorHandler(async (req) => {
  try {

    const data = await model.destination.find({ status: 0 }).select("galleryImages").lean();

    const allGalleryImages = data.flatMap(
      property => property.galleryImages || []
    );

    return new Response(null, { data: allGalleryImages }, 200);

  } catch (error) {

    throw new Error(error.message);
  }

})