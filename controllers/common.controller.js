import { asyncErrorHandler, Error, Response } from "express-error-catcher";
import model from "../model/index.js";
import { deleteSupabaseImage } from "../helper/functions.js";

// Deletes the object from Supabase storage. Accepts either a raw storage path
// or a full public URL via ?path=.
export const deleteImage = asyncErrorHandler(async (req) => {
  const { path: pathName } = req.query;

  if (!pathName) throw new Error("Path is required", 412);

  await deleteSupabaseImage(pathName);

  return new Response("Deleted successfully", null, 200);
});

export const getFeatureOptions = asyncErrorHandler(async (req) => {
  const data = await model.FeatureOptions.find({ status: 0 }).sort({ _id: -1 });

  return new Response(null, { data }, 200);
});

export const addFeatureOptions = asyncErrorHandler(async (req) => {
  const { name } = req.body;

  const exists = await model.FeatureOptions.findOne({ name, status: 0 });

  if (exists) throw new Error(`${exists.name} already exists`, 400);

  const data = await model.FeatureOptions({ name }).save();

  return new Response(`Option added successfully`, { data }, 200);
});

export const getPropertyHighlights = asyncErrorHandler(async (req) => {
  const data = await model.propertyHiglights.find({ status: 0 }).sort({ _id: -1 });

  return new Response(null, { data }, 200);
});

export const addPropertyHighlights = asyncErrorHandler(async (req) => {
  const { name } = req.body;

  const exists = await model.propertyHiglights.findOne({ name, status: 0 });

  if (exists) throw new Error(`${exists.name} already exists`, 400);

  const data = await model.propertyHiglights({ name }).save();

  return new Response(`Option added successfully`, { data }, 200);
});

export const getGalleryImages = asyncErrorHandler(async (req) => {
  const data = await model.destination.find({ status: 0 }).select("galleryImages").lean();

  const allGalleryImages = data.flatMap((property) => property.galleryImages || []);

  return new Response(null, { data: allGalleryImages }, 200);
});

// Typed lookup list — the CMS calls `common/category?type=service`.
export const getCategory = asyncErrorHandler(async (req) => {
  const { type } = req.query;

  const query = { status: 0 };

  if (!isNull(type)) query.type = type;

  const data = await model.category
    .find(query)
    .sort({ _id: -1 })
    .select("label value type")
    .lean();

  return new Response(null, { data }, 200);
});

export const addCategory = asyncErrorHandler(async (req) => {
  let { type, label, value } = req.body;

  if (isNull(type)) throw new Error("Type is required", 412);
  if (isNull(label)) throw new Error("Label is required", 412);

  if (isNull(value)) value = label;

  const exists = await model.category.findOne({ type, value, status: 0 });

  if (exists) throw new Error(`${exists.label} already exists`, 400);

  const data = await model.category({ type, label, value }).save();

  return new Response(`Category added successfully`, { data }, 200);
});
