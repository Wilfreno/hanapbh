import { model, Schema, Types, ValidatorProps } from "mongoose";

export type UserType = {
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  password: string | null;
  birthday?: Date;
  gender?: {
    type: "MALE" | "FEMALE" | "OTHER";
    other: string;
  };

  photo?: Types.ObjectId;
  properties?: Types.ObjectId[];
  reviewed?: Types.ObjectId[];
  favorites?: Types.ObjectId[];
  bio: string;
  occupancies: Types.ObjectId[];
  activities: Types.ObjectId[];
  contact?: {
    phone_number: string;
    facebook: string;
    instagram: string;
    twitter: string;
  };
  date_created?: Date;
  last_updated: Date;
};

const userSchema = new Schema<UserType>(
  {
    first_name: {
      type: String,
      required: true,
    },
    middle_name: {
      type: String,
      default: "",
    },
    last_name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: "",
    },
    occupancies: [
      { type: Schema.Types.ObjectId, ref: "Occupant", default: [] },
    ],
    activities: [
      {
        type: Schema.Types.ObjectId,
        ref: "Activity",
        default: [],
      },
    ],
    email: {
      type: String,
      required: true,
      unique: true,

      validate: {
        validator: (v: string) => {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props: ValidatorProps) =>
          `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      default: null,
    },
    birthday: {
      type: Date,
      // required: true,
    },
    gender: {
      type: {
        type: String,
        enum: ["MALE", "FEMALE", "OTHER"],
      },
      other: { type: String },
    },

    contact: {
      phone_number: { type: String, default: "" },
      facebook: {
        type: String,
        default: "",
      },
      instagram: {
        type: String,
        default: "",
      },
      twitter_x: {
        type: String,
        default: "",
      },
    },
    properties: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lodging",
        default: [],
      },
    ],
    reviewed: [{ type: Schema.Types.ObjectId, ref: "Review", default: [] }],

    photo: {
      type: Schema.Types.ObjectId,
      ref: "Photo",
      default: null,
    },
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Favorite",
        default: [],
      },
    ],
    date_created: {
      type: Date,
      default: Date.now,
    },
    last_updated: { type: Date, required: true },
  },
  { versionKey: false }
);

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

const User = model("User", userSchema);

export default User;
