"use client";
import { Property } from "@/lib/types/data-type";
import { useMemo } from "react";
import LodgingCardsSkeleton from "@/components/page/loading-skeleton/LodgingCardsSkeleton";
import PropertyCard from "@/components/page/PropertyCard";
import PageFilter from "@/components/page/nearby/filter/PageFilter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import LoadingSvg from "@/components/svg/LoadingSvg";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { GETRequest } from "@/lib/server/fetch";
import OutOfBound from "@/components/page/error/location/OutOfBound";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import ListSort from "@/components/page/nearby/sort/ListSort";
import LocationNone from "@/components/page/error/location/LocationNone";
import PermissionDenied from "@/components/page/error/location/PermissionDenied";
import useUserLocation from "@/components/hooks/useUserLocation";

export default function Page() {
  const user_location = useUserLocation();

  const distance = useSearchParams().get("distance");
  const property_type = useSearchParams().get("type");
  const amenities = useSearchParams().get("am");
  const name_sort = useSearchParams().get("name_sort");
  const distance_sort = useSearchParams().get("distance_sort");

  const { data, error, isFetching, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      enabled: !!user_location,
      queryKey: ["nearby_properties", distance, user_location],
      queryFn: async ({ pageParam }) => {
        const {
          data: response,
          status,
          message,
        } = await GETRequest<{
          result: Property[];
          next_page: number | null;
        }>("/v1/property/nearby", {
          latitude: user_location?.coordinates?.lat.toString()!,
          longitude: user_location?.coordinates?.lng.toString()!,
          page: pageParam.toString(),
          max_distance: distance ? distance : "500",
        });

        if (status !== "OK") {
          toast.warning(message);
          throw new Error(status);
        }
        return response;
      },
      initialPageParam: 1,
      getNextPageParam: (data) => data!.next_page,
    });

  const filtered_data = useMemo(() => {
    let new_data = data?.pages;

    if (property_type) {
      new_data = new_data!.map((data) => ({
        ...data,
        result: data.result.filter((result) =>
          property_type.split("|").some((type) => type === result.type)
        ),
      }));
    }

    if (amenities) {
      new_data = new_data?.map((data) => ({
        ...data,
        result: data.result.filter((result) =>
          result.amenities.some((am) =>
            amenities.split("|").some((a) => a === am)
          )
        ),
      }));
    }

    if (name_sort) {
      new_data = new_data?.map((data) => ({
        ...data,
        result: data.result.toSorted((a, b) =>
          name_sort === "z-a"
            ? b.name.localeCompare(a.name)
            : a.name.localeCompare(b.name)
        ),
      }));
    }

    if (distance_sort) {
      new_data = new_data?.map((data) => ({
        ...data,
        result: data.result.toSorted((a, b) =>
          distance_sort === "9-0"
            ? b.distance - a.distance
            : a.distance - b.distance
        ),
      }));
    }
    return new_data;
  }, [data, property_type, amenities, name_sort, distance_sort]);

  if (user_location?.error === "LOCATION_NONE") return <LocationNone />;
  if (user_location?.error === "PERMISSION_DENIED") return <PermissionDenied />;
  if (error?.message === "OUT_OF_BOUND") return <OutOfBound />;
  return (
    <main className="grid grid-rows-[auto_1fr_auto] sm:px-[10vw] py-8 space-y-8 scroll-smooth">
      <div className="flex items-center mx-5 space-x-1">
        <PageFilter />
        <ListSort />
      </div>

      <section className="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:gap-4 scroll-smooth">
        {filtered_data ? (
          filtered_data.map((page) =>
            page.result.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          )
        ) : (
          <LodgingCardsSkeleton />
        )}
      </section>
      <Button
        className={cn(
          "w-fit justify-self-center rounded-full",
          (!hasNextPage || !user_location) && "hidden"
        )}
        variant="ghost"
        onClick={() => fetchNextPage()}
      >
        {isFetching ? (
          <LoadingSvg className="h-8 w-auto fill-primary" />
        ) : (
          "Load More"
        )}
      </Button>
    </main>
  );
}
