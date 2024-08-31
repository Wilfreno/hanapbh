import { model } from "mongoose";
import { Schema } from "mongoose";
import { Types } from "mongoose";

export type ActivityType = {
  user: Types.ObjectId;
  type: "FAVORITE" | "REVIEW" | "OCCUPYING" | "LEFT";
  favored?: Types.ObjectId;
  reviewed?: Types.ObjectId;
  occupancy?: Types.ObjectId;
  date_created: Date;
};

const activitySchema = new Schema<ActivityType>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["FAVORITE", "REVIEW", "OCCUPYING", "LEFT"],
    required: true,
  },
  favored: {
    type: Schema.Types.ObjectId,
    ref: "Favorite",
  },
  reviewed: {
    type: Schema.Types.ObjectId,
    ref: "Review",
  },
  occupancy: {
    type: Schema.Types.ObjectId,
    ref: "Occupant",
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
});

activitySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

const Activity = model("Activity", activitySchema);

export default Activity;
