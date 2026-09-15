import { asyncErrorHandler, Error, Response } from "express-error-catcher";
import model from "../model/index.js";
import { paginationParams, unwantedFields } from "../helper/functions.js";

export const list = asyncErrorHandler(async (req) => {
    const { skip, limit } = paginationParams(req.query);

    const data = await model.jobPost
        .find({ status: 0 })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .select(unwantedFields())
        .lean();

    return new Response("success", { data }, 200);
});

export const create = asyncErrorHandler(async (req) => {
    const { title, desc, department, location, jobType, requirements } = req.body;

    if (isNull(title)) throw new Error("Title is required", 412);

    const data = await model.jobPost({
        title,
        desc,
        department,
        location,
        jobType,
        requirements: (requirements || []).filter((r) => !isNull(r)),
    }).save();

    return new Response("Job post added successfully", { data }, 200);
});

// PUT carries the id in the body (frontend: put("job-post", values)).
export const update = asyncErrorHandler(async (req) => {
    const { id, title, desc, department, location, jobType, requirements } = req.body;

    if (isNull(id)) throw new Error("Id is required", 412);

    const data = await model.jobPost.findOne({ _id: id, status: 0 });

    if (!data) throw new Error("Data not found", 404);

    if (!isNull(title)) data.title = title;
    if (!isNull(desc)) data.desc = desc;
    if (!isNull(department)) data.department = department;
    if (!isNull(location)) data.location = location;
    if (!isNull(jobType)) data.jobType = jobType;
    if (requirements) data.requirements = requirements.filter((r) => !isNull(r));

    await data.save();

    return new Response("Job post updated successfully", { data }, 200);
});

export const remove = asyncErrorHandler(async (req) => {
    const { id } = req.params;

    const data = await model.jobPost.findOne({ _id: id, status: 0 });

    if (!data) throw new Error("Data not found", 404);

    data.status = 1;
    await data.save();

    return new Response("Job post deleted successfully", { data }, 200);
});
