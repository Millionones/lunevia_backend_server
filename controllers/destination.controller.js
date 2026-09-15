import { asyncErrorHandler, Error, Response } from "express-error-catcher";
import model from "../model/index.js";
import { generatePermalink, paginationParams, unwantedFields } from "../helper/functions.js";

export const list = asyncErrorHandler(async (req) => {
    const { category } = req.query;

    const { skip, limit } = paginationParams(req.query);

    const query = { status: 0 };

    if (!isNull(category)) query.category = category;

    const data = await model.destination.find(query).sort({ _id: -1 }).skip(skip).limit(limit).select(unwantedFields()).lean();

    return new Response("success", { data }, 200);
});

export const create = asyncErrorHandler(async (req) => {

    let {
        title,
        mainImage,
        locationLink,
        aboutProperty,
        galleryImages,
        roomDetails,
        amenties,
        locations,
    } = req.body;

    // Validation
    if (isNull(title)) {
        throw new Error("Title is required", 412);
    }

    if (isNull(mainImage)) {
        throw new Error("Main image is required", 412);
    }

    if (isNull(locationLink)) {
        throw new Error("Location link is required", 412);
    }

    const slug = generatePermalink(title);

    // Check existing
    const exists = await model.destination.findOne({
        $or: [{ title }, { slug }],
    });

    if (exists) {
        throw new Error(`${exists.title} already exists.`);
    }

    if (roomDetails && roomDetails.length > 0) {
        // Strip the UI-only `completed` flag the wizard adds to each room.
        roomDetails = roomDetails.map(({ completed, ...room }) => ({
            ...room,
            slug: room.slug || generatePermalink(room.title),
        }));
    }

    // Create data
    const data = await new model.destination({
        title,
        slug,
        mainImage,
        locationLink,

        aboutProperty: {
            image: aboutProperty?.image,
            description: aboutProperty?.description,
            highlights: aboutProperty?.highlights || [],
        },

        galleryImages: galleryImages || [],

        roomDetails: roomDetails || [],

        amenties: amenties || [],

        locations: locations || [],

        // addedBy: req.user._id,
    }).save();

    return new Response(
        "Property added successfully",
        { data },
        200
    );
});

export const get = asyncErrorHandler(async (req) => {
    const { slug } = req.params;
    console.log(slug);
    const data = await model.destination.findOne({ slug, status: 0 }).select(unwantedFields()).lean();

    if (!data) {
        throw new Error("Data not found", 404);
    }
    return new Response("success", { data }, 200);
});

export const update = asyncErrorHandler(async (req) => {
    const { slug } = req.params;
    let { title,
        mainImage,
        locationLink,
        aboutProperty,
        galleryImages,
        roomDetails,
        amenties,
        locations,
    } = req.body;

    const data = await model.destination.findOne({ slug, status: 0 });

    if (!data) {
        throw new Error("Data not found", 404);
    }

    if (roomDetails && roomDetails.length > 0) {
        // Strip the UI-only `completed` flag; keep existing room slugs, generate
        // one for any newly added room.
        roomDetails = roomDetails.map(({ completed, ...room }) => ({
            ...room,
            slug: room.slug || generatePermalink(room.title),
        }));
    }

    if (!isNull(title)) data.title = title;
    if (!isNull(mainImage)) data.mainImage = mainImage;
    if (!isNull(locationLink)) data.locationLink = locationLink;
    if (!isNull(aboutProperty)) data.aboutProperty = aboutProperty;
    if (!isNull(galleryImages)) data.galleryImages = galleryImages;
    if (!isNull(roomDetails)) data.roomDetails = roomDetails;
    if (!isNull(amenties)) data.amenties = amenties;
    if (!isNull(locations)) data.locations = locations;

    await data.save();

    return new Response("success", { data }, 200);
});

export const deleteProperty = asyncErrorHandler(async (req) => {
    const { slug } = req.params;
    const data = await model.destination.findOne({ slug, status: 0 });

    if (!data) {
        throw new Error("Data not found", 404);
    }

    data.status = 1;
    await data.save();
    return new Response("success", { data }, 200);
});