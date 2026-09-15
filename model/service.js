import { model, Schema } from "mongoose";
import { currentDate, currentTime } from "../helper/functions.js";

// Shape mirrors the multi-section formik tree in the CMS
// (app/(cms)/admin/(pages)/services/page.jsx). Sections are stored verbatim so
// the admin form can round-trip them.
const titleContent = {
    title: { type: String, default: "" },
    content: { type: String, default: "" },
};

const schema = new Schema(
    {
        status: { type: Number, default: 0 }, // 0 - active , 1 - deleted , 2 - deactivated
        name: { type: String, required: true },
        slug: { type: String },
        category: { type: String },

        sec1: titleContent,
        sec2: [
            {
                img: { type: String, default: "" },
                title: { type: String, default: "" },
                content: { type: String, default: "" },
            },
        ],
        sec3: titleContent,
        sec4: {
            title: { type: String, default: "" },
            contents: [titleContent],
        },
        sec5: {
            title: { type: String, default: "" },
            content: [titleContent],
        },
        sec6: titleContent,

        faq: [
            {
                question: { type: String, default: "" },
                answer: { type: String, default: "" },
            },
        ],

        date: { type: String, default: currentDate() },
        time: { type: String, default: currentTime() },
    },
    {
        timestamps: true,
    }
);

schema.index({ status: 1, _id: -1 });

export default model("service", schema);
