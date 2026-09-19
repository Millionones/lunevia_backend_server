import { model, Schema } from "mongoose";
import { currentDate, currentTime } from "../helper/functions.js";

const schema = new Schema(
    {
        status: { type: Number, default: 0 }, // 0 - Pending , 1 - Confirmed , 2 - Cancelled
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        mobile: { type: String, required: true },
        guestNo: { type: Number },
        adults: { type: Number },
        childrens: { type: Number },
        checkIn: { type: String },
        checkInTime: { type: String },
        checkOut: { type: String },
        checkOutTime: { type: String },
        destination: { type: Schema.Types.ObjectId, ref: "destination" },
        room: { type: String },
        date: { type: String, default: currentDate },
        time: { type: String, default: currentTime },
    },
    {
        timestamps: true,
    }
);

// Admin bookings list filters by status and sorts by _id; bookings are also
// grouped per destination.
schema.index({ status: 1, _id: -1 });
schema.index({ destination: 1 });

export default model("bookings", schema);
