type E = "LOCATION_NONE" | "PERMISSION_DENIED" | null;
type C = {
  lat: number;
  lng: number;
} | null;

export type UserLocation = {
  coordinates: C;
  error: E;
};
