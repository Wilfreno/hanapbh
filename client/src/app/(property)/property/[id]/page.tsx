"use client";

import useHTTPRequest from "@/components/hooks/useHTTPRequest";
import CustomImage from "@/components/page/CustomImage";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/lib/redux/store";
import { Property } from "@/lib/types/data-type";
import { ServerResponse } from "@/lib/types/server-response";
import { cn } from "@/lib/utils";
import {
  AirVent,
  Bath,
  Bookmark,
  Cctv,
  Container,
  CookingPot,
  Droplet,
  MapPin,
  ParkingMeter,
  Pin,
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
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<Property>();
  const [review_avg, setReviewAvg] = useState(3.5);
  const [response_status, setResponseStatus] =
    useState<ServerResponse["status"]>();

  const user_location = useAppSelector((state) => state.user_location);

  const from = useSearchParams().get("f");
  const http_request = useHTTPRequest();

  useEffect(() => {
    if (!user_location) return;
    async function getProperty() {
      const { data, status } = await http_request.GET<Property>(
        "/v1/property/" + params.id,
        { latitude: user_location?.lat, longitude: user_location?.lng }
      );

      setResponseStatus(status);
      if (status !== "OK") return;

      setProperty(data);
      // setReviewAvg(
      //   d?.reviews.length
      //     ? d?.reviews
      //         .map((review) => review.rate)
      //         .reduce((latest, rate) => latest + rate) / d.reviews.length
      //     : 0
      // );
    }

    getProperty();
  }, [user_location]);

  if (response_status !== "OK") return null;
  return (
    <main className="relative w-screen py-12 px-10 space-y-8">
      <header className="flex items-start justify-between">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">{property?.name}</h1>
            <h2 className="text-muted-foreground">
              {property?.address.vicinity}
            </h2>
          </div>
          <div className="flex items-center space-x-4 font-medium">
            <div className="flex space-x-1">
              {Array.from({
                length: 5,
              }).map((_, index) =>
                Math.floor(review_avg) === index + 1 ? (
                  Math.floor(review_avg) !== review_avg ? (
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
                      index + 1 < review_avg
                        ? "fill-primary"
                        : "stroke-muted-foreground"
                    )}
                  />
                )
              )}
            </div>
            <span className="flex items">
              {review_avg} {"("} {property?.reviews.length} reviews {")"}
            </span>
          </div>
        </div>
        <div className="space-x-4">
          <Link href={from ? from : "/demo"}>
            <Button size="sm">Go Back</Button>
          </Link>
        </div>
      </header>
      <div className="flex space-x-4 justify-between">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Description</h1>
            <div className="prose text-primary">
              <p>{property?.description}</p>
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Amenities</h1>
            <div className="grid grid-cols-3 gap-4  ">
              {property?.amenities.map((am, index) => {
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
              <span>{property?.distance.toFixed(2)} meters</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="aspect-video w-auto h-[70dvh] overflow-hidden">
            <CustomImage
              photo={property?.photos ? property?.photos[0] : null}
              provider={property?.provider}
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
