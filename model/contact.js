import { model, Schema } from "mongoose";
import { currentDate, currentTime } from "../helper/functions.js";

const schema = new Schema(
    {
        status: { type: Number, default: 0 },
        firstName: { type: String, required: true },
        lastName: { type: String },
        email: { type: String, required: true },
        mobile: { type: String, required: true },
        subject: { type: String },
        comments: {
            type: String,
        },
        date: { type: String, default: currentDate },
        time: { type: String, default: currentTime },
    },
    {
        timestamps: true,
    }
);

export default model("contact", schema);
