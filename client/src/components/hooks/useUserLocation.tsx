"use client";
import { useToast } from "../ui/use-toast";
import { UserLocation } from "@/lib/types/user-location";
import { isServer, useQuery } from "@tanstack/react-query";

export default function useUserLocation() {
  const { toast } = useToast();

  const { data: user_location } = useQuery<UserLocation>({
    enabled: !isServer,
    queryKey: ["user_location"],
    queryFn: () => {
      return new Promise((resolve) => {
        if (!navigator.geolocation.getCurrentPosition) {
          toast({
            description: "Location detector is not supported in your browser",
          });
          resolve({
            coordinates: null,
            error: "LOCATION_NONE",
          });

          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              coordinates: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
              error: null,
            });
          },
          (error) => {
            if (error.PERMISSION_DENIED)
              resolve({
                coordinates: null,
                error: "PERMISSION_DENIED",
              });
          }
        );
      });
    },
  });

  return user_location;
}
