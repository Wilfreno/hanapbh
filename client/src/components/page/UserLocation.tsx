"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import useHTTPRequest from "../hooks/useHTTPRequest";
import { MapPinOff, MapPinX, MapPinXInside } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { setUserLocation } from "@/lib/redux/slices/user-location";

type C = {
  lat: number;
  lng: number;
} | null;
type E = "LOCATION_NONE" | "OUT_OF_BOUND" | "PERMISSION_DENIED";

export default function UserLocation({
  children,
}: {
  children: React.ReactNode;
}) {
  const [error, setError] = useState<E>();
  const [coords, setCoords] = useState<C>(null);

  const dispatch = useDispatch<AppDispatch>();

  const { toast } = useToast();
  const http_request = useHTTPRequest();

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
          console.log(position);
          dispatch(
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude, 
            })
          );
        },
        (error) => {
          if (error.PERMISSION_DENIED) setError("PERMISSION_DENIED");
        }
      );
    }
    if (error !== "LOCATION_NONE") getPosition();
  }, []);

  // useEffect(() => {
  //   if (!lat || !lng) return;

  //   async function validateUserLocation() {
  //     try {
  //       const { status } = await http_request.POST("/v1/location/validate", {
  //         latitude: lat,
  //         longitude: lng,
  //       });

  //       setOutOfBound(status === "OUT_OF_BOUND");
  //     } catch (error) {
  //       throw error;
  //     }
  //   }
  //   validateUserLocation();
  // }, [lat, lng]);

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
    case "OUT_OF_BOUND": {
      return (
        <main className="my-auto grid place-content-center space-y-5">
          <MapPinX className="h-auto w-[5vw] stroke-2 stroke-white mx-auto fill-muted-foreground" />
          <span className="text-center text-lg text-muted-foreground">
            <p>
              Looks like your trying to access the app outside the Philippines.
            </p>
            <p>Nothing wil be displayed but you can still use the search bar</p>
          </span>
        </main>
      );
    }
    default:
      return children;
  }
}
