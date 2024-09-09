"use client";
import useUserLocation from "@/components/hooks/useUserLocation";
import CustomImage from "@/components/page/CustomImage";
import LocationNone from "@/components/page/error/location/LocationNone";
import PermissionDenied from "@/components/page/error/location/PermissionDenied";
import OutOfBound from "@/components/page/error/OutOfBound";
import { Button } from "@/components/ui/button";
import { GETRequest } from "@/lib/server/fetch";
import { Property } from "@/lib/types/data-type";
import { UserLocation } from "@/lib/types/user-location";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AirVent,
  Bath,
  Bookmark,
  Cctv,
  CircleAlert,
  Container,
  CookingPot,
  Droplet,
  MapPin,
  ParkingMeter,
  ShowerHead,
  Star,
  StarHalf,
  TvMinimal,
  WashingMachine,
  Wifi,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";

export default function Page({ params }: { params: { id: string } }) {
  const from = useSearchParams().get("from");

  const user_location = useUserLocation();

  const { data, error, isLoading } = useQuery({
    enabled: !!user_location,
    queryKey: ["data", params.id],
    queryFn: async () => {
      try {
        const { data, status, message } = await GETRequest<Property>(
          "/v1/property/" +
            params.id +
            "?longitude=" +
            user_location?.coordinates?.lng +
            "&latitude=" +
            user_location?.coordinates?.lat
        );

        if (status !== "OK") {
          toast(message);
          throw new Error(message);
        }

        return data;
      } catch (error) {
        throw error;
      }
    },
  });

  if (error?.message === "OUT_OF_BOUND") return <OutOfBound />;
  if (user_location?.error === "LOCATION_NONE") return <LocationNone />;
  if (user_location?.error === "PERMISSION_DENIED") return <PermissionDenied />;
  return (
    <main className="relative w-screen py-12 px-10 space-y-8">
      <header className="grid w-full">
        <div className="space-x-4 justify-self-end">
          <Link href={from ? from : "/"}>
            <Button size="sm">Go Back</Button>
          </Link>
        </div>
        <div className="space-y-4">
          <span className="space-y-1">
            <h1
              className={cn(
                "text-3xl font-bold",
                isLoading && "animate-pulse bg-muted rounded-lg w-1/3 h-10"
              )}
            >
              {data?.name}
            </h1>
            <h2
              className={cn(
                "text-muted-foreground",
                isLoading && "animate-pulse bg-muted rounded-lg w-1/3 h-4"
              )}
            >
              {data?.address.vicinity}
            </h2>
          </span>
          <div className="flex items-center space-x-4 font-medium">
            <div className="flex space-x-1">
              {Array.from({
                length: 5,
              }).map((_, index) =>
                Math.floor(data?.rating!) === index + 1 ? (
                  Math.floor(data?.rating!) !== data?.rating! ? (
                    <span key={index} className="relative">
                      <StarHalf className="fill-primary h-5 w-auto stroke" />
                      <Star className="absolute h-5 w-auto top-0 left-0" />
                    </span>
                  ) : (
                    <Star key={index} className="fill-primary h-5 w-auto" />
                  )
                ) : (
                  <Star
                    key={index}
                    className={cn(
                      "h-5 w-auto  fill-muted",
                      index + 1 < data?.rating!
                        ? "fill-primary"
                        : "stroke-muted-foreground"
                    )}
                  />
                )
              )}
            </div>
            <p className="flex items">
              <span
                className={cn(
                  isLoading && "w-6 h-4 bg-muted animate-pulse rounded-lg"
                )}
              >
                {data?.rating!}
              </span>{" "}
              {"("} {data?.reviews.length} reviews {")"}
            </p>
            {data?.provider === "DB" && <CircleAlert className="h-4" />}
          </div>
        </div>
      </header>
      <div className="flex space-x-4 justify-between">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Description</h1>
            <div className="prose text-primary">
              <p>
                {!data?.description ? data?.description : "(No Description)"}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Amenities</h1>
            <div className="grid grid-cols-3 gap-4  ">
              {data?.amenities.map((am, index) => {
                let am_icon;
                let am_text = "";
                switch (am) {
                  case "AIR_CONDITION": {
                    am_text = "Air Condition";
                    am_icon = <AirVent className="h-6" />;
                    break;
                  }
                  case "CCTV": {
                    am_text = "CCTV";
                    am_icon = <Cctv className="h-6" />;
                    break;
                  }
                  case "COMMON_BATHROOM": {
                    am_text = "Common Bathroom";
                    am_icon = <ShowerHead className="h-6" />;
                    break;
                  }
                  case "FREE_ELECTRICITY": {
                    am_text = "Free Electricity";
                    am_icon = <Zap className="h-6" />;
                    break;
                  }
                  case "FREE_WATER": {
                    am_text = "Free Water";
                    am_icon = <Droplet className="h-6" />;
                    break;
                  }
                  case "FREE_WIFI": {
                    am_text = "Free Wifi";
                    am_icon = <Wifi className="h-6" />;
                    break;
                  }
                  case "KITCHEN_AREA": {
                    am_text = "Kitchen Area";
                    am_icon = <CookingPot className="h-6" />;
                    break;
                  }
                  case "LAUNDRY_AREA": {
                    am_text = "Laundry Area";
                    am_icon = <WashingMachine className="h-6" />;
                    break;
                  }
                  case "LOCKERS": {
                    am_text = "Lockers";
                    am_icon = <Container className="h-6" />;
                    break;
                  }
                  case "PARKING_LOT": {
                    am_text = "Parking Area";
                    am_icon = <ParkingMeter className="h-6" />;
                    break;
                  }
                  case "PRIVATE_BATHROOM": {
                    am_text = "Private Bathroom";
                    am_icon = <Bath className="h-6" />;
                    break;
                  }
                  case "TELEVISION": {
                    am_text = "Television";
                    am_icon = <TvMinimal className="h-6" />;
                    break;
                  }
                }

                return (
                  <p key={index} className="flex items-center gap-2">
                    {am_icon}
                    <span>{am_text}</span>
                  </p>
                );
              })}
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Distance from You</h1>
            <div className="flex items-center gap-2 text-primary">
              <MapPin className="h-6" />
              <span>{data?.distance.toFixed(2)} meters</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="aspect-video w-auto h-[70dvh] overflow-hidden">
            <CustomImage
              photo={data?.photos ? data?.photos[0] : null}
              provider={data?.provider}
            />
          </div>
          <Button size="lg" className="w-fit self-end gap-2">
            <span className="text-lg   font-bold">Book Now </span>
            <Bookmark className="h-full" />
          </Button>
        </div>
      </div>
    </main>
  );
}
