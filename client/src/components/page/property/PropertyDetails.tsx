import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Property } from "@/lib/types/data-type";
import { cn } from "@/lib/utils";
import {
  AirVent,
  Bath,
  Cctv,
  Container,
  CookingPot,
  Droplet,
  MapPin,
  ParkingMeter,
  ShowerHead,
  TvMinimal,
  WashingMachine,
  Wifi,
  Zap,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useUserLocation from "@/components/hooks/useUserLocation";
import { useParams } from "next/navigation";

export default function PropertyDetails() {
  const user_location = useUserLocation();
  const params = useParams<{ id: string }>();
  const { data } = useQuery<Property>({
    enabled: !!user_location,
    queryKey: ["property", params.id, user_location],
  });

  return (
    <div className="space-y-8 grow">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Description</h1>
        <div className="prose text-primary space-y-4 w-full">
          {!data ? (
            <>
              <div className="rounded-lg bg-muted animate-pulse h-4 w-4/5"></div>
              <div className="rounded-lg bg-muted animate-pulse h-4 w-3/5 "></div>
            </>
          ) : data?.description.length ? (
            data?.description.map((text, index) => <p key={index}>{text}</p>)
          ) : (
            <span className="text-muted-foreground font-medium">
              {"(No Description)"}
            </span>
          )}
        </div>
      </div>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Amenities</h1>
        <div className="grid grid-cols-3 gap-4">
          {!data ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="w-full h-10 rounded-lg bg-muted animate-pulse"
              ></div>
            ))
          ) : data?.amenities.length ? (
            data?.amenities.map((am, index) => {
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
            })
          ) : (
            <p className="whitespace-nowrap text-muted-foreground font-medium ">
              (No Details Available)
            </p>
          )}
        </div>
      </div>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Distance from You</h1>
        <div className="flex items-center gap-2 text-primary">
          <MapPin className="h-6" />
          <p className="flex gap-2">
            <span
              className={cn(
                !data &&
                  "bg-muted animate-pulse rounded-lg h-6 w-10 text-center"
              )}
            >
              {data?.distance.toFixed(2)}
            </span>
            <span>meters</span>
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Your Host</h1>

        {!data ? (
          <>
            <span className="flex items-center gap-4">
              <div className="aspect-square rounded-full bg-muted animate-pulse h-10 w-auto"></div>
              <div className="w-full space-y-1">
                <div className="rounded-lg bg-muted animate-pulse h-4 w-3/5"></div>
                <div className="rounded-lg bg-muted animate-pulse h-2 w-2/5"></div>
              </div>
            </span>
            <div className="rounded-lg bg-muted animate-pulse h-4 w-4/5"></div>
            <div className="rounded-lg bg-muted animate-pulse h-4 w-3/5 "></div>
          </>
        ) : data.provider === "GOOGLE" ? (
          <p className="text-muted-foreground font-medium">
            (No Details Available)
          </p>
        ) : (
          <div>
            <Avatar>
              <AvatarImage src={data?.owner?.photo?.url} />
              <AvatarFallback className="font-bold">
                {data?.owner?.first_name.substring(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </div>
  );
}
