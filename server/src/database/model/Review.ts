import { Types } from "mongoose";
import { model, Schema } from "mongoose";

export type ReviewType = {
  reviewer: Types.ObjectId;
  property: Types.ObjectId;
  rate: number;
  comment: string;
  relative_time_description: string;
  user_google_url: string;
  provider: "DB" | "GOOGLE";
  date_created: Date;
  last_updated: Date;
};

const reviewSchema = new Schema<ReviewType>(
  {
    reviewer: { type: Schema.Types.ObjectId, ref: "User" },
    property: { type: Schema.Types.ObjectId, ref: "Property" },
    rate: { type: Number, required: true },
    comment: { type: String, default: "" },
    provider: { type: String, enum: ["DB", "GOOGLE"], default: "DB" },
    date_created: { type: Date, default: Date.now },
    last_updated: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

reviewSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

const Review = model("Review", reviewSchema);

export default Review;
