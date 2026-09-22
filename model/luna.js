import { model, Schema } from "mongoose";
import { currentDate, currentTime } from "../helper/functions.js";

// Single-document knowledge base for the "Luna" website assistant. Mirrors the
// pageContent keyed-singleton pattern: exactly one active doc (key "knowledge")
// whose `content` holds the whole aggregated payload (brand + faqs + rooms +
// destinations) as free-form JSON. It is rebuilt from the live CMS data
// (destinations/services/faq page) so the frontend fetches this one doc only.
const schema = new Schema(
    {
        status: { type: Number, default: 0 }, // 0 - active , 1 - deleted
        key: { type: String, default: "knowledge", unique: true },
        content: { type: Schema.Types.Mixed, default: {} },
        date: { type: String, default: currentDate },
        time: { type: String, default: currentTime },
    },
    {
        timestamps: true,
        minimize: false, // persist empty objects/arrays instead of stripping them
    }
);

schema.index({ key: 1, status: 1 });

export default model("luna", schema);
