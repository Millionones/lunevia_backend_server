import { model, Schema } from "mongoose";
import { currentDate, currentTime } from "../helper/functions.js";

// One document per website page (keyed by `page`). `content` holds that page's
// whole editable payload as free-form JSON (hero + sections + card arrays +
// gallery + hero slides), so each page can keep its own shape without schema
// churn. The website renders these values with hardcoded fallbacks, so a missing
// field never breaks the UI.
const schema = new Schema(
    {
        status: { type: Number, default: 0 }, // 0 - active , 1 - deleted
        page: { type: String, required: true }, // "home" | "about" | "experience" | ...
        content: { type: Schema.Types.Mixed, default: {} },
        date: { type: String, default: currentDate },
        time: { type: String, default: currentTime },
    },
    {
        timestamps: true,
        minimize: false, // persist empty objects/arrays instead of stripping them
    }
);

schema.index({ page: 1, status: 1 });

export default model("pageContent", schema);
