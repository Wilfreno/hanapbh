"use client";

import React, { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { MapPinOff, MapPinXInside } from "lucide-react";
type E = "LOCATION_NONE" | "PERMISSION_DENIED";
type C = {
  lat: number;
  lng: number;
} | null;

export default function UserLocation({
  children,
  coordinates,
}: {
  children: React.ReactNode;
  coordinates: (coords: C) => void;
}) {
  const [error, setError] = useState<E>();

  const { toast } = useToast();

  useEffect(() => {
    if (!navigator.geolocation.getCurrentPosition) {
      toast({
        description: "Location detector is not supported in your browser",
      });

      setError("LOCATION_NONE");

      return;
    }
    function getPosition() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          coordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          if (error.PERMISSION_DENIED) setError("PERMISSION_DENIED");
        }
      );
    }
    if (error !== "LOCATION_NONE") getPosition();
  }, []);

  switch (error) {
    case "PERMISSION_DENIED": {
      return (
        <main className="my-auto grid place-content-center space-y-5">
          <MapPinOff className="h-auto w-[5vw] stroke-2 stroke-white mx-auto fill-muted-foreground" />
          <span className="text-lg text-muted-foreground text-center">
            <p>Location access is denied</p>
            <p>
              To continue using this site please allow it to access your
              location
            </p>
          </span>
        </main>
      );
    }
    case "LOCATION_NONE": {
      return (
        <main className="my-auto grid place-content-center space-y-5">
          <MapPinXInside className="h-auto w-[5vw] stroke-2 stroke-white mx-auto fill-muted-foreground" />
          <p className="text-center text-lg text-muted-foreground">
            Location detector is not supported in your browser no data will be
            displayed
          </p>
        </main>
      );
    }
    default:
      return children;
  }
}
