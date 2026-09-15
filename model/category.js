import { model, Schema } from "mongoose";

// Generic typed lookup list. `type` groups categories by domain (e.g. "service")
// so the CMS can request `common/category?type=service`. `value` is the stored
// key, `label` the human-readable name.
const schema = new Schema(
    {
        status: { type: Number, default: 0 }, // 0 - active , 1 - deleted , 2 - deactivated
        type: { type: String, required: true },
        label: { type: String, required: true },
        value: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

schema.index({ type: 1, status: 1 });

export default model("category", schema);
