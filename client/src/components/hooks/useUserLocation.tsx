"use client";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "../ui/use-toast";
import { UserLocation } from "@/lib/types/user-location";

export default function useUserLocation() {
  const [user_location, setUserLocation] = useState<UserLocation>();
  const { toast } = useToast();

  useEffect(() => {
    if (!navigator.geolocation.getCurrentPosition) {
      toast({
        description: "Location detector is not supported in your browser",
      });
      setUserLocation({
        coordinates: null,
        error: "LOCATION_NONE",
      });
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          error: null,
        });
      },
      (error) => {
        if (error.PERMISSION_DENIED)
          setUserLocation({
            coordinates: null,
            error: "PERMISSION_DENIED",
          });
      }
    );
  }, []);
  return user_location;
}
