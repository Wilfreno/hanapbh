export type User = {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  password?: string;
  birthday?: Date;
  gender?: {
    type: "MALE" | "FEMALE" | "OTHER" | "";
    other: string;
  };
  lodgings?: Property[];

  rated?: Rating[];

  contact?: {
    phone_number: string;
    facebook: string;
    instagram: string;
    twitter_x: string;
  };
  photo?: {
    url: string;
    width: number;
    height: number;
  };
  favorites?: Favorite[];
  date_created?: Date;
  last_updated?: Date;
};

export type Property = {
  id: string;
  owner?: User;
  name: string;
  type?: "BOARDING_HOUSE" | "BED_SPACER" | "APARTMENT" | "PAD";
  description: string;
  amenities: (
    | "FREE_WATER"
    | "FREE_WIFI"
    | "FREE_ELECTRICITY"
    | "LAUNDRY_AREA"
    | "KITCHEN_AREA"
    | "AIR_CONDITION"
    | "PRIVATE_BATHROOM"
    | "COMMON_BATHROOM"
    | "TELEVISION"
    | "LOCKERS"
    | "CCTV"
    | "PARKING_LOT"
  )[];
  occupancies: Occupant[];
  activities: Types.ObjectId[];

  location: {
    type: "Point";
    coordinates: [number, number];
  };
  distance: number;
  address: {
    vicinity: string;
    street: string;
    province: string;
    municipality_city: string;
    barangay: string;
  };
  provider: "GOOGLE" | "DB";
  photos: Photo[];
  reviews: Review[];
  rooms: Room[];
  date_created: Date;
  last_updated?: Date;
};

export type Photo = {
  url: string;
  type?: "PROFILE" | "PROPERTY" | "ROOM";
  user?: Types.ObjectId;
  property?: Types.ObjectId;
  room?: Types.ObjectId;
  date_created?: Date;
  last_updated?: Date;
};

export type Review = {
  reviewer: User;
  property: Property;
  rate: number;
  comment: string;
  date_created: Date;
  last_updated?: Date;
};

export type Occupant = {
  room: Room;
  user: User;
  status: "OCCUPYING" | "LEFT";
  joined: Date;
  left: Date;
};

export type Activity = {
  user: User;
  type: "FAVORITE" | "REVIEW" | "OCCUPYING" | "LEFT";
  favored?: Favorite;
  reviewed?: Review;
  occupancy?: Occupant;
  date_created: Date;
};
