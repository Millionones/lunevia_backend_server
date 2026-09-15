import { asyncErrorHandler, Error, Response } from "express-error-catcher";
import model from "../model/index.js";
import { generatePermalink, paginationParams, unwantedFields } from "../helper/functions.js";

const SECTION_FIELDS = ["sec1", "sec2", "sec3", "sec4", "sec5", "sec6", "faq", "category"];

export const list = asyncErrorHandler(async (req) => {
    const { skip, limit } = paginationParams(req.query);

    const data = await model.service
        .find({ status: 0 })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .select(unwantedFields())
        .lean();

    return new Response("success", { data }, 200);
});

export const create = asyncErrorHandler(async (req) => {
    const body = req.body;

    if (isNull(body.name)) throw new Error("Name is required", 412);

    const slug = isNull(body.slug) ? generatePermalink(body.name) : generatePermalink(body.slug);

    const exists = await model.service.findOne({ slug, status: 0 });

    if (exists) throw new Error(`${exists.name} already exists.`, 400);

    const data = await new model.service({
        name: body.name,
        slug,
        category: body.category,
        sec1: body.sec1,
        sec2: body.sec2,
        sec3: body.sec3,
        sec4: body.sec4,
        sec5: body.sec5,
        sec6: body.sec6,
        faq: body.faq,
    }).save();

    return new Response("Service added successfully", { data }, 200);
});

// PUT carries the id in the body (frontend: put("/service", values)).
export const update = asyncErrorHandler(async (req) => {
    const body = req.body;
    const id = body.id || body._id;

    if (isNull(id)) throw new Error("Id is required", 412);

    const data = await model.service.findOne({ _id: id, status: 0 });

    if (!data) throw new Error("Data not found", 404);

    if (!isNull(body.name)) data.name = body.name;
    if (!isNull(body.slug)) data.slug = generatePermalink(body.slug);

    for (const field of SECTION_FIELDS) {
        if (!isNull(body[field])) data[field] = body[field];
    }

    await data.save();

    return new Response("Service updated successfully", { data }, 200);
});

export const remove = asyncErrorHandler(async (req) => {
    const { id } = req.params;

    const data = await model.service.findOne({ _id: id, status: 0 });

    if (!data) throw new Error("Data not found", 404);

    data.status = 1;
    await data.save();

    return new Response("Service deleted successfully", { data }, 200);
});
