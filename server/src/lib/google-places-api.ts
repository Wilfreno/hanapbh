import { PropertyType } from "../database/model/Property";
import { GooglePlacesAPINearbyResponse } from "./types/google-places-api-types";
import { PhotoType } from "../database/model/Photo";
import getDistance from "./distance";

export type PlacesDetailsResponse = {
  status: string;
  result: {
    business_status:
      | "OPERATIONAL"
      | "CLOSED_TEMPORARILY"
      | "CLOSED_PERMANENTLY";
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    place_id: string;
    name: string;
    photos: [
      {
        height: number;
        photo_reference: string;
        width: number;
      }
    ];
    vicinity: string;
  };
};
export async function getNearbyProperty({
  latitude,
  longitude,
}: Record<"latitude" | "longitude", string>) {
  const places_api_key = process.env.GOOGLE_PLACES_API_KEY;
  if (!places_api_key)
    throw new Error("GOOGLE_PLACES_API_KEY is missing from your .env file");

  try {
    const places_api_response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${places_api_key}&location=${latitude}%2C${longitude}&type=lodging&rankby=distance`
    );

    const places_api_response_json =
      (await places_api_response.json()) as GooglePlacesAPINearbyResponse;

    let next_page_token = places_api_response_json.next_page_token;

    let result = [] as (Omit<
      PropertyType,
      | "owner"
      | "photos"
      | "description"
      | "reviews"
      | "rooms"
      | "date_created"
      | "last_updated"
    > & {
      id: string;
      photos: PhotoType[];
    })[];

    for (const place of places_api_response_json.results) {
      result.push({
        id: place.place_id,
        name: place.name,
        type: "BOARDING_HOUSE",
        amenities: [],
        photos: place.photos
          ? place.photos.map((photo) => ({
              type: "PROPERTY",
              url: photo.photo_reference,
              property_id: null,
              last_updated: new Date(),
            }))
          : [],
        location: {
          type: "Point",
          coordinates: [
            place.geometry.location.lng,
            place.geometry.location.lat,
          ],
        },
        address: {
          vicinity: place.vicinity,
          street: "",
          barangay: "",
          municipality_city: "",
          province: "",
        },
        provider: "GOOGLE",
        distance: getDistance(
          {
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
          },
          { latitude: Number(latitude), longitude: Number(longitude) }
        ),
      });
    }

    while (next_page_token) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const next_page_response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${places_api_key}&pagetoken=${next_page_token}`
      );
      const next_page_response_json =
        (await next_page_response.json()) as GooglePlacesAPINearbyResponse;

      for (const place of next_page_response_json.results) {
        result.push({
          id: place.place_id,
          name: place.name,
          type: "BOARDING_HOUSE",
          amenities: [],
          photos: place.photos
            ? place.photos.map((photo) => ({
                type: "PROPERTY",
                url: photo.photo_reference,
                height: photo.height,
                width: photo.width,
                property_id: null,
                last_updated: new Date(),
              }))
            : [],
          location: {
            type: "Point",
            coordinates: [
              place.geometry.location.lng,
              place.geometry.location.lat,
            ],
          },
          address: {
            vicinity: place.vicinity,
            street: "",
            barangay: "",
            municipality_city: "",
            province: "",
          },
          provider: "GOOGLE",
          distance: getDistance(
            {
              latitude: place.geometry.location.lat,
              longitude: place.geometry.location.lng,
            },
            { latitude: Number(latitude), longitude: Number(longitude) }
          ),
        });
        next_page_token = next_page_response_json.next_page_token;
      }
    }

    return result;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getPropertyDetails(place_id: string) {
  const places_api_key = process.env.GOOGLE_PLACES_API_KEY;
  if (!places_api_key)
    throw new Error("GOOGLE_PLACES_API_KEY is missing from your .env file");

  try {
    const response = await fetch(
      "https://maps.googleapis.com/maps/api/place/details/json?key=" +
        places_api_key +
        "&place_id=" +
        place_id
    );

    const response_json = (await response.json()) as PlacesDetailsResponse;
    if (response_json.status !== "OK") throw new Error(response_json.status);
    return {
      id: response_json.result.place_id,
      name: response_json.result.name,
      address: {
        barangay: "",
        municipality_city: "",
        province: "",
        street: "",
        vicinity: response_json.result.vicinity,
      },
      amenities: [],

      location: {
        coordinates: [
          response_json.result.geometry.location.lng,
          response_json.result.geometry.location.lat,
        ],
        type: "Point",
      },
      reviews: [],
      rooms: [],
      photos: response_json.result.photos
        ? response_json.result.photos.map((photo) => ({
            type: "PROPERTY",
            url: photo.photo_reference,
            property_id: null,
            last_updated: new Date(),
          }))
        : [],
      provider: "GOOGLE",
      type: "BOARDING_HOUSE",
    } satisfies Omit<
      PropertyType,
      | "owner"
      | "photos"
      | "description"
      | "date_created"
      | "last_updated"
      | "distance"
    > & {
      id: string;
      photos: PhotoType[];
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}
