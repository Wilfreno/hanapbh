import { model, Schema, Types } from "mongoose";

export type PhotoType = {
  url: string;
  type?: "PROFILE" | "PROPERTY" | "ROOM";
  user?: Types.ObjectId;
  property?: Types.ObjectId;
  room?: Types.ObjectId;
  date_created?: Date;
  last_updated: Date;
};

const photoSchema = new Schema<PhotoType>(
  {
    url: { type: String, required: true },
    type: {
      type: String,
      enum: ["PROFILE", "PROPERTY", "ROOM"],
    },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    property: { type: Schema.Types.ObjectId, ref: "Property" },
    room: { type: Schema.Types.ObjectId, ref: "Room" },
    date_created: { type: Date, default: Date.now },
    last_updated: { type: Date, required: true },
  },
  { versionKey: false }
);

photoSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

const Photo = model("Photo", photoSchema);

export default Photo;
