import { model, Schema } from "mongoose";
import { currentDate, currentTime } from "../helper/functions.js";

const schema = new Schema(
    {
        status: { type: Number, default: 0 }, // 0 - active , 1 - deleted , 2 - deactivated
        name: { type: String, required: true },
        designation: { type: String },
        url: { type: String }, // optional video url
        image: { type: String },
        testimonial: { type: String, required: true },
        date: { type: String, default: currentDate },
        time: { type: String, default: currentTime },
    },
    {
        timestamps: true,
    }
);

schema.index({ status: 1, _id: -1 });

export default model("testimonial", schema);
