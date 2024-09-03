"use client";
import UserLocation from "@/components/page/UserLocation";
import { Property } from "@/lib/types/data-type";
import { useEffect, useState } from "react";
import LodgingCardsSkeleton from "@/components/page/loading-skeleton/LodgingCardsSkeleton";
import PropertyCard from "@/components/page/PropertyCard";
import ListFilter from "@/components/page/ListFilter";
import ListSort from "@/components/page/ListSort";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import LoadingSvg from "@/components/svg/LoadingSvg";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { GETRequest } from "@/lib/server/fetch";

type C = {
  lat: number;
  lng: number;
} | null;

export default function Page() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [modified_list, setModifiedList] = useState<Property[]>([]);
  const [page, setPage] = useState<number>(1);
  const [filter, setFilter] = useState({
    distance: 500,
    property_type: new Map(),
    amenities: new Map(),
  });
  const [sort, setSort] = useState({ name: "", distance: "ascend" });

  const { getQueryData } = useQueryClient();

  const coords = getQueryData<C>(["user_location"]);

  const { data, error, isFetching, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      enabled: !!coords,
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
          latitude: coords?.lat.toString()!,
          longitude: coords?.lng.toString()!,
          page: pageParam.toString(),
          max_distance: filter.distance.toString(),
        });

        if (status !== "OK") throw new Error(message);
        return response;
      },
      initialPageParam: 1,
      getNextPageParam: (data) => data!.next_page,
    });

  useEffect(() => {
    if (!properties.length) return;

    if (filter.property_type.size)
      setModifiedList((prev) =>
        prev.filter((property) => filter.property_type.has(property.type!))
      );
    if (filter.amenities.size) {
      setModifiedList((prev) =>
        prev.filter((property) => {
          const l = [];
          filter.amenities.forEach((value) => {
            if (property.amenities.find(value as any)) {
              return true;
            }
          });
        })
      );
    }

    if (!filter.property_type.size && !filter.amenities.size)
      setModifiedList([]);
  }, [filter.amenities, filter.property_type, properties]);

  useEffect(() => {
    if (!properties.length) return;

    if (!sort.name) return;

    switch (sort.name) {
      case "ascend": {
        modified_list.length
          ? setModifiedList((prev) =>
              prev.toSorted((a, b) => a.name.localeCompare(b.name))
            )
          : setProperties((prev) =>
              prev.toSorted((a, b) => a.name.localeCompare(b.name))
            );
        break;
      }
      case "descend": {
        modified_list.length
          ? setModifiedList((prev) =>
              prev.toSorted((a, b) => b.name.localeCompare(a.name))
            )
          : setProperties((prev) =>
              prev.toSorted((a, b) => b.name.localeCompare(a.name))
            );
        break;
      }
      default:
        break;
    }
  }, [sort.name]);

  useEffect(() => {
    if (!properties.length) return;

    switch (sort.distance) {
      case "ascend": {
        modified_list.length
          ? setModifiedList((prev) =>
              prev.toSorted((a, b) => a.distance - b.distance)
            )
          : setProperties((prev) =>
              prev.toSorted((a, b) => a.distance - b.distance)
            );
        break;
      }
      case "descend": {
        modified_list.length
          ? setModifiedList((prev) =>
              prev.toSorted((a, b) => b.distance - a.distance)
            )
          : setProperties((prev) =>
              prev.toSorted((a, b) => b.distance - a.distance)
            );
        break;
      }
      default:
        break;
    }
  }, [sort.distance]);

  return (
    <main className="grid grid-rows-[auto_1fr_auto] sm:px-[10vw] py-8 space-y-8 scroll-smooth">
      <div className="flex items-center mx-5 space-x-1">
        <ListFilter filter={filter} setFilter={setFilter} />
        <ListSort sort={sort} setSort={setSort} />
      </div>
      <UserLocation>
        <section className="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:gap-4 scroll-smooth">
          {modified_list.length
            ? modified_list.map((property) => (
                <PropertyCard key={property.name} property={property} />
              ))
            : properties.length &&
              properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
          {isFetching && <LodgingCardsSkeleton />}
        </section>
      </UserLocation>
      <Button
        className={cn(
          "w-fit justify-self-center rounded-full",
          !page || (isFetching && "hidden")
        )}
        variant="ghost"
        onClick={() => setPage((prev) => prev! + 1)}
      >
        Load More
      </Button>
    </main>
  );
}
