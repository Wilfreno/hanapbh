"use client";

import React, { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { MapPinOff, MapPinX, MapPinXInside } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GETRequest } from "@/lib/server/fetch";
import { Property } from "@/lib/types/data-type";

type E = "LOCATION_NONE" | "PERMISSION_DENIED";

export default function UserLocation({
  children,
}: {
  children: React.ReactNode;
}) {
  const [error, setError] = useState<E>();

  const { toast } = useToast();
  const { setQueryData } = useQueryClient();

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
          setQueryData(["user_Location"], () => ({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }));
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
