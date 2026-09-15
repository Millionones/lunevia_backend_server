import { asyncErrorHandler, Error, Response } from "express-error-catcher";
import model from "../model/index.js";
import { unwantedFields } from "../helper/functions.js";

// Whitelisted page keys the CMS manages (mirrors the website routes).
export const PAGES = [
    "home",
    "about",
    "experience",
    "contact",
    "destinations",
    "blog",
    "faq",
    "testimonials",
    "privacy",
    "terms",
];

export const list = asyncErrorHandler(async (req) => {
    const data = await model.pageContent
        .find({ status: 0 })
        .sort({ page: 1 })
        .select(unwantedFields())
        .lean();

    return new Response("success", { data }, 200);
});

export const getByPage = asyncErrorHandler(async (req) => {
    const { page } = req.params;

    const data = await model.pageContent
        .findOne({ page, status: 0 })
        .select(unwantedFields())
        .lean();

    return new Response("success", { data }, 200);
});

// Upsert-by-page: the admin saves { page, content }. Creates the doc on first
// save, replaces `content` thereafter. Both POST and PUT route here.
export const upsert = asyncErrorHandler(async (req) => {
    const { page, content } = req.body;

    if (isNull(page)) throw new Error("Page is required", 412);
    if (!PAGES.includes(page)) throw new Error("Invalid page", 412);

    const data = await model.pageContent
        .findOneAndUpdate(
            { page, status: 0 },
            { $set: { content: content ?? {} } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        )
        .select(unwantedFields())
        .lean();

    return new Response("Page content saved successfully", { data }, 200);
});

export const remove = asyncErrorHandler(async (req) => {
    const { id } = req.params;

    const data = await model.pageContent.findOne({ _id: id, status: 0 });

    if (!data) throw new Error("Data not found", 404);

    data.status = 1;
    await data.save();

    return new Response("Page content deleted successfully", { data }, 200);
});
