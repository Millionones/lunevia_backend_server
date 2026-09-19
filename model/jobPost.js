import { model, Schema } from "mongoose";
import { currentDate, currentTime } from "../helper/functions.js";

// Careers postings. Collection name kept as "job-post" to match the frontend
// route (`get("job-post")`, `del("job-post/:id")`).
const schema = new Schema(
    {
        status: { type: Number, default: 0 }, // 0 - active , 1 - deleted , 2 - deactivated
        title: { type: String, required: true },
        desc: { type: String },
        department: { type: String },
        location: { type: String },
        jobType: { type: String }, // Full-time | Part-time | Contract
        requirements: [{ type: String }],
        date: { type: String, default: currentDate },
        time: { type: String, default: currentTime },
    },
    {
        timestamps: true,
    }
);

schema.index({ status: 1, _id: -1 });

export default model("job-post", schema);
