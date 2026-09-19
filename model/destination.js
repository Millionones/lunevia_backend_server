import { model, Schema } from "mongoose";
import { currentDate, currentTime } from "../helper/functions.js";
const roomFeatures = [
    {
        label: { type: String, },
        answer: { type: String, }
    }
]
const galleryImage = [{ type: String }]
const schema = new Schema(
    {
        ip: String,
        status: { type: Number, default: 0 },  // 0 - active , 1 - deleted , 2 - deactivated
        title: { type: String, required: true },
        slug: { type: String, required: true },
        mainImage: { type: String, required: true },
        locationLink: { type: String, required: true },
        aboutProperty: {
            image: { type: String, required: true },
            description: { type: String, required: true },
            highlights: [{ type: Schema.Types.ObjectId, ref: "propertyHighlights" }]
        },
        galleryImages: galleryImage,

        roomDetails: [{
            title: { type: String, required: true },
            image: { type: String, required: true },
            description: { type: String, required: true },
            features: roomFeatures,
            price: { type: Number, default: 0 },
            availableFeatures: {type: String },
            resortAmenities: { type: String },
            slug: { type: String, required: true },
        }],

        amenties: [
            {
                title: { type: String, required: true },
                image: { type: String, required: true },
                description: { type: String, required: true },
            }
        ],

        locations: [
            {
                title: { type: String, required: true },
                image: { type: String, required: true },
                description: { type: String, required: true },
            }
        ],

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
)

// Indexes for the hot query paths:
// - detail lookups: findOne({ slug, status })
// - list endpoints: find({ status }).sort({ _id: -1 })
schema.index({ slug: 1, status: 1 });
schema.index({ status: 1, _id: -1 });

export default model("destination", schema);
