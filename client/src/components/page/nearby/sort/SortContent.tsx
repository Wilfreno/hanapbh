"use effect";
import useSearchParamsGenerator from "@/components/hooks/useSearchParamsGenerator";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function SortContent() {
  const [selected, setSelected] = useState({
    name: "a-z",
    distance: "0-9",
  });

  const { concat } = useSearchParamsGenerator();
  const name_sort = useSearchParams().get("name_sort");
  const distance_sort = useSearchParams().get("distance_sort");
  const name_sort_items = [
    { name: "Ascend", value: "a-z" },
    { name: "Descend", value: "z-a" },
  ];
  const distance_sort_items = [
    { name: "Ascend", value: "0-9" },
    { name: "Descend", value: "9-0" },
  ];

  useEffect(() => {
    if (name_sort) setSelected((prev) => ({ ...prev, name: name_sort }));
    if (distance_sort)
      setSelected((prev) => ({ ...prev, distance: distance_sort }));
  }, []);
  return (
    <div className="p-5 space-y-8 pb-10">
      <div className="space-y-5">
        <h1 className="text-lg font-bold">Name</h1>
        <div className="flex gap-3 flex-wrap">
          {name_sort_items.map((item) => (
            <Button
              onClick={() => {
                concat("name_sort", item.value);
                setSelected((prev) => ({ ...prev, name: item.value }));
              }}
              key={item.name}
              className="rounded-full"
              variant={selected.name === item.value ? "default" : "outline"}
            >
              {item.name}
            </Button>
          ))}
        </div>
      </div>
      <div className="space-y-5">
        <h1 className="text-lg font-bold">Distance</h1>
        <div className="flex gap-3 flex-wrap">
          {distance_sort_items.map((item) => (
            <Button
              onClick={() => {
                concat("distance_sort", item.value);
                setSelected((prev) => ({ ...prev, distance: item.value }));
              }}
              key={item.name}
              className="rounded-full"
              variant={selected.distance === item.value ? "default" : "outline"}
            >
              {item.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
