import useUserLocation from "@/components/hooks/useUserLocation";
import { Property } from "@/lib/types/data-type";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import GoogleMap from "../map/GoogleMap";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { Map, MapPin } from "lucide-react";
import { useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PropertyMap() {
  const user_location = useUserLocation();
  const params = useParams<{ id: string }>();
  const { data } = useQuery<Property>({
    enabled: !!user_location,
    queryKey: ["property", params.id, user_location],
  });

  const property_location = useMemo<Property["location"] | null>(() => {
    if (!data) return null;
    return data?.location;
  }, [data]);

  return (
    <div className="grid gap-4">
      <h1 className="text-3xl font-bold">Where You&apos;ll be</h1>
      <div className="aspect-video w-4/5 h-auto mx-auto rounded-lg overflow-hidden grid bg-muted relative">
        <Link
          href={"/map/" + data?.id}
          as={"/map/" + data?.id}
          prefetch
          className="absolute top-3 right-5 z-10"
        >
          <Button variant="secondary" className="gap-1">
            <span>See Map</span>
            <Map className="h-4" />
          </Button>
        </Link>
        {data && (
          <GoogleMap
            center={{
              lng: property_location!.coordinates[0]!,
              lat: property_location!.coordinates[1]!,
            }}
            zoom={18}
            className="pointer-events-none"
          >
            <AdvancedMarker
              position={{
                lng: property_location!.coordinates[0]!,
                lat: property_location!.coordinates[1]!,
              }}
            >
              <MapPin className="h-10  w-auto stroke-background  animate-bounce" />
            </AdvancedMarker>
          </GoogleMap>
        )}
      </div>
    </div>
  );
}
