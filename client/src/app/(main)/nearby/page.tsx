"use client";
import UserLocation from "@/components/page/UserLocation";
import { Property } from "@/lib/types/data-type";
import { useState } from "react";
import LodgingCardsSkeleton from "@/components/page/loading-skeleton/LodgingCardsSkeleton";
import PropertyCard from "@/components/page/PropertyCard";
import ListFilter from "@/components/page/ListFilter";
import ListSort from "@/components/page/ListSort";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import LoadingSvg from "@/components/svg/LoadingSvg";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { GETRequest } from "@/lib/server/fetch";
import OutOfBound from "@/components/page/error/OutOfBound";

type C = {
  lat: number;
  lng: number;
} | null;

export default function Page() {
  const [modified_list, setModifiedList] = useState<Property[]>([]);
  const [user_location, setUserLocation] = useState<C>(null);
  const [filter, setFilter] = useState({
    distance: 500,
    property_type: new Map(),
    amenities: new Map(),
  });
  const [sort, setSort] = useState({ name: "", distance: "ascend" });

  const { data, error, isFetching, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      enabled: !!user_location,
      queryKey: ["nearby_properties", filter.distance],
      queryFn: async ({ pageParam }) => {
        const {
          data: response,
          status,
          message,
        } = await GETRequest<{
          result: Property[];
          next_page: number | null;
        }>("/v1/property/nearby", {
          latitude: user_location?.lat.toString()!,
          longitude: user_location?.lng.toString()!,
          page: pageParam.toString(),
          max_distance: filter.distance.toString(),
        });

        if (status !== "OK") throw new Error(status);
        return response;
      },
      initialPageParam: 1,
      getNextPageParam: (data) => data!.next_page,
    });

  console.log(data);
  return (
    <main className="grid grid-rows-[auto_1fr_auto] sm:px-[10vw] py-8 space-y-8 scroll-smooth">
      <div className="flex items-center mx-5 space-x-1">
        <ListFilter filter={filter} setFilter={setFilter} />
        <ListSort sort={sort} setSort={setSort} />
      </div>
      {error?.message === "OUT_OF_BOUND" ? (
        <OutOfBound />
      ) : (
        <UserLocation coordinates={(c) => setUserLocation(c)}>
          <section className="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:gap-4 scroll-smooth">
            {modified_list.length ? (
              modified_list.map((property) => (
                <PropertyCard key={property.name} property={property} />
              ))
            ) : data ? (
              data.pages.map((page) =>
                page.result.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))
              )
            ) : (
              <LodgingCardsSkeleton />
            )}
          </section>
        </UserLocation>
      )}
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
