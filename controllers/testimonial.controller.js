import { asyncErrorHandler, Error, Response } from "express-error-catcher";
import model from "../model/index.js";
import { paginationParams, unwantedFields } from "../helper/functions.js";

export const list = asyncErrorHandler(async (req) => {
    const { skip, limit } = paginationParams(req.query);

    const data = await model.testimonial
        .find({ status: 0 })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .select(unwantedFields())
        .lean();

    return new Response("success", { data }, 200);
});

export const create = asyncErrorHandler(async (req) => {
    const { name, designation, url, image, testimonial } = req.body;

    if (isNull(name)) throw new Error("Name is required", 412);
    if (isNull(testimonial)) throw new Error("Testimonial is required", 412);

    const data = await model.testimonial({
        name,
        designation,
        url,
        image,
        testimonial,
    }).save();

    return new Response("Testimonial added successfully", { data }, 200);
});

// PUT carries the id in the body (frontend: put("testimonial", values)).
export const update = asyncErrorHandler(async (req) => {
    const { id, name, designation, url, image, testimonial } = req.body;

    if (isNull(id)) throw new Error("Id is required", 412);

    const data = await model.testimonial.findOne({ _id: id, status: 0 });

    if (!data) throw new Error("Data not found", 404);

    if (!isNull(name)) data.name = name;
    if (!isNull(designation)) data.designation = designation;
    if (!isNull(url)) data.url = url;
    if (!isNull(image)) data.image = image;
    if (!isNull(testimonial)) data.testimonial = testimonial;

    await data.save();

    return new Response("Testimonial updated successfully", { data }, 200);
});

export const remove = asyncErrorHandler(async (req) => {
    const { id } = req.params;

    const data = await model.testimonial.findOne({ _id: id, status: 0 });

    if (!data) throw new Error("Data not found", 404);

    data.status = 1;
    await data.save();

    return new Response("Testimonial deleted successfully", { data }, 200);
});
