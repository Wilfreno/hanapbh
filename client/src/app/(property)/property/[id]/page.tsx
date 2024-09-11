"use client";
import useUserLocation from "@/components/hooks/useUserLocation";
import LocationNone from "@/components/page/error/location/LocationNone";
import PermissionDenied from "@/components/page/error/location/PermissionDenied";
import OutOfBound from "@/components/page/error/OutOfBound";
import PropertyDetails from "@/components/page/property/PropertyDetails";
import PropertyHeader from "@/components/page/property/PropertyHeader";
import PropertyImage from "@/components/page/property/PropertyImage";
import { GETRequest } from "@/lib/server/fetch";
import { Property } from "@/lib/types/data-type";
import { useQuery } from "@tanstack/react-query";
import { toast }  from "sonner";

export default function Page({ params }: { params: { id: string } }) {
  const user_location = useUserLocation();

  const { data, error } = useQuery({
    enabled: !!user_location,
    queryKey: ["data", params.id, user_location],
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

  const isLoading = true;
  if (error?.message === "OUT_OF_BOUND") return <OutOfBound />;
  if (user_location?.error === "LOCATION_NONE") return <LocationNone />;
  if (user_location?.error === "PERMISSION_DENIED") return <PermissionDenied />;
  return (
    <main className="relative w-screen py-12 px-10 space-y-8">
      <PropertyHeader property={data} is_loading={isLoading} />
      <div className="flex space-x-4">
        <PropertyDetails property={data} is_loading={isLoading} />
        <PropertyImage property={data} is_loading={isLoading} />
      </div>
    </main>
  );
}
