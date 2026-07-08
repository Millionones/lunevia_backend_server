import multer from "multer";
import path from "path";
import fs from "fs";
import moment from "moment";

import { Types } from "mongoose";
import { Error } from "express-error-catcher";
import { supabase } from "../supabase.js";
import sharp from "sharp";
import crypto from "crypto";
import nodemailer from "nodemailer";

const storage = (folder) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = `public/uploads/${folder}`;
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileExtension = path.extname(file.originalname);
      const originalFileName = path.basename(file.originalname, fileExtension);
      const fileName = originalFileName.replace(/\s/g, "-").replace(/--/, "-") + "-" + uniqueSuffix + fileExtension;
      cb(null, fileName);
    },
  });

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`${allowedExtensions.join(",").replace(/[.,]/g, " ").replace(/\s/, "")} files are allowed`, 400));
  }
};

export const multerUpload = (folder = "", filter, limits = null) => {
  if (!filter) filter = fileFilter;
  // return multer({ storage: storage(folder), fileFilter: filter, limits });
  return multer({
    storage: multer.memoryStorage(),
    fileFilter: filter,
    limits,
  });
};

export const currentDate = () => moment().format("YYYY-MM-DD");

export const currentTime = () => moment().format("HH:mm:ss");

// export const imageFileName = async (req, res) => {
//   try {
//     const data = req.file;
//     if (req.file) {
//       data.new_filename = data.destination.replace("public/", "") + "/" + data.filename;
//       res.status(200).json({ status: 200, data });
//     } else {
//       res.status(400).json("something went wrong");
//     }
//   } catch (error) {
//     res.status(400).json(error.message);
//   }
// };

export const imageFileName = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const folder = req.params.folder;

    // 1. Process image (resize + webp)
    const { fileName, buffer } = await processImage(req.file.buffer);

    // 2. Upload to Supabase
    const result = await uploadImage(
      supabase,
      folder,
      fileName,
      buffer
    );

    return res.status(200).json({
      status: 200,
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

export const processImage = async (buffer) => {
  const fileName = crypto.randomUUID();

  const imageBuffer = await sharp(buffer)
    .resize(1600, 1600, {
      fit: "inside", // keeps aspect ratio
      withoutEnlargement: true,
    })
    .webp({ quality: 85 })
    .toBuffer();

  return {
    fileName,
    buffer: imageBuffer,
  };
};

export const uploadImage = async (supabase, folder, fileName, buffer) => {
  const filePath = `${folder}/${fileName}.webp`;

  const { error } = await supabase.storage
    .from("lunevia")
    .upload(filePath, buffer, {
      contentType: "image/webp",
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from("lunevia")
    .getPublicUrl(filePath);

  return {
    path: filePath,
    url: data.publicUrl,
  };
};

export const generatePermalink = (str) => {
  var code = str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return code;
};

export function paginationParams(query) {
  let { page = 1, limit = 20 } = query;

  page = Number(page);
  limit = Number(limit);

  // limit = limit > 100 ? 20 : limit;

  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export const unwantedFields = (obj = false) => (obj ? { createdAt: 0, updatedAt: 0, __v: 0 } : "-createdAt -updatedAt -__v");

export function isValidObjectId(id) {
  return Types.ObjectId.isValid(id) && new Types.ObjectId(id).toString() === id;
}

export async function counter(model, key = "") {
  const count = (await model.countDocuments()) + 1;
  return (key ? `${key}` : "") + count.toString().padStart(4, "0");
}


export const sendMail = async ({from,  subject, html }) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  console.log(process.env.EMAIL_USER,'jjjjjj',process.env.EMAIL_PASS)

  await transporter.sendMail({
    from: "luneviaEnquiry@gmail.com",
    to: process.env.EMAIL_USER,
    subject,
    html,
  });
};