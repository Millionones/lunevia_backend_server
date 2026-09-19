import { model, Schema } from "mongoose";

import { currentDate, currentTime } from "../helper/functions.js";

const schema = new Schema(
    {
        ip: String,
        status: { type: Number, default: 0 },
        slug: { type: String, unique: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        writer: { type: String },
        category: { type: String, required: true },
        image: { type: String, required: true },
        addedBy: { type: Schema.Types.ObjectId, ref: "user" },
        updateBy: { type: Schema.Types.ObjectId, ref: "user" },
        date: { type: String, default: currentDate },
        time: { type: String, default: currentTime },
        upDate: String,
        upTime: String,
    },
    {
        timestamps: true,
    }
);

// slug already has a unique index (from `unique: true`).
// List endpoints filter by status and sort by _id; category is filterable.
schema.index({ status: 1, _id: -1 });
schema.index({ category: 1 });

export default model("blogs", schema);