import useSearchParamsGenerator from "../../../hooks/useSearchParamsGenerator";
import { useEffect, useState } from "react";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function FilterContent() {
  const [custom_distance, setCustomDistance] = useState({
    display: false,
    value: "",
    items: [] as typeof distance_items,
  });
  const [selected, setSelected] = useState({
    distance: 500,
    type: [] as string[],
    amenities: [] as string[],
  });
  const { concat, remove } = useSearchParamsGenerator();

  const distance = useSearchParams().get("distance");
  const type = useSearchParams().get("type");
  const amenities = useSearchParams().get("am");

  const distance_items = [
    { name: "Under 100m", value: 100 },
    { name: "Under 200m", value: 200 },
    { name: "Under 300m", value: 300 },
    { name: "Under 400m", value: 400 },
    { name: "Under 500m", value: 500 },
  ];

  const property_type_items = [
    { name: "Boarding House", value: "BOARDING_HOUSE" },
    { name: "Bed Spacer", value: "BED_SPACER" },
    { name: "Apartment", value: "APARTMENT" },
    { name: "Pad", value: "PAD" },
    { name: "Any", value: "ANY" },
  ];

  const amenities_items = [
    { name: "Free water", value: "FREE_WATER" },
    { name: "Free WIFI", value: "FREE_WIFI" },
    { name: "Free electricity", value: "FREE_ELECTRICITY" },
    { name: "Laundry area", value: "LAUNDRY_AREA" },
    { name: "kitchen area", value: "KITCHEN_AREA" },
    { name: "Air condition", value: "AIR_CONDITION" },
    { name: "Private Bathroom", value: "PRIVATE_BATHROOM" },
    { name: "Common bathroom", value: "COMMON_BATHROOM" },
    { name: "Television", value: "TELEVISION" },
    { name: "Lockers", value: "LOCKERS" },
    { name: "CCTV", value: "CCTV" },
    { name: "Parking Lot", value: "PARKING_LOT" },
    { name: "Any", value: "ANY" },
  ];

  useEffect(() => {
    if (distance)
      setSelected((prev) => ({ ...prev, distance: Number(distance) }));
    if (type) setSelected((prev) => ({ ...prev, type: type.split("|") }));
    if (amenities)
      setSelected((prev) => ({ ...prev, amenities: amenities.split("|") }));
  }, []);

  return (
    <div className="space-y-8">
      {/* distance */}
      <div className="space-y-5">
        <h1 className="text-lg font-bold">Distance</h1>
        <div className="flex gap-4 flex-wrap">
          {distance_items.map((item) => (
            <Button
              onClick={() => {
                setSelected((prev) => ({ ...prev, distance: item.value }));
                concat("distance", item.value.toString());
              }}
              key={item.name}
              variant={selected.distance === item.value ? "default" : "outline"}
            >
              {item.name}
            </Button>
          ))}
          <Button
            variant={custom_distance.display ? "default" : "outline"}
            onClick={() => {
              setCustomDistance((prev) => ({
                ...prev,
                display: !prev.display,
              }));
            }}
          >
            Custom
          </Button>
          {!!custom_distance.items.length &&
            custom_distance.items.map((item, index) => (
              <div key={item.name} className="relative">
                <Button
                  onClick={() => {
                    setSelected((prev) => ({
                      ...prev,
                      distance: item.value,
                    }));
                    concat("distance", item.value.toString());
                  }}
                  key={item.name}
                  className="rounded-full"
                  variant={
                    selected.distance === item.value ? "default" : "outline"
                  }
                >
                  {item.name}
                </Button>
                <X
                  className="h-6 absolute -top-2 -right-3 bg-primary rounded-full stroke-2 stroke-background p-1 cursor-pointer"
                  onClick={() => {
                    setCustomDistance((prev) => ({
                      ...prev,
                      display: !(prev.items.length === 1),
                      items: prev.items.toSpliced(index, 1),
                    }));

                    if (custom_distance.items.length === 1)
                      setSelected((prev) => ({ ...prev, distance: 500 }));
                  }}
                />
              </div>
            ))}
        </div>
        {custom_distance.display && (
          <form
            autoComplete="off"
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              setSelected((prev) => ({
                ...prev,
                distance: Number(custom_distance.value),
              }));

              if (
                custom_distance.value === "100" ||
                custom_distance.value === "200" ||
                custom_distance.value === "300" ||
                custom_distance.value === "400" ||
                custom_distance.value === "500"
              )
                return;

              setCustomDistance((prev) => ({
                ...prev,
                items: [
                  ...prev.items,
                  {
                    name: "under " + custom_distance.value + "m",
                    value: Number(custom_distance.value),
                  },
                ],
              }));
              concat("distance", custom_distance.value.toString());

              setCustomDistance((prev) => ({ ...prev, value: "" }));
            }}
          >
            <Label htmlFor="custom" className="font-bold">
              Input Custom distance by meter
            </Label>
            <div className="flex items-center space-x-5">
              <Input
                type="text"
                inputMode="numeric"
                id="custom"
                max={50000}
                value={custom_distance.value}
                onChange={(e) =>
                  setCustomDistance((prev) => ({
                    ...prev,
                    value: e.target.value,
                  }))
                }
                placeholder="Up to 50000 meters"
                pattern="^[0-4]?\d{0,4}$|50000"
                title="Give a valid number"
              />
              <Button
                type="submit"
                className="rounded-full"
                disabled={!custom_distance.value}
              >
                Confirm
              </Button>
            </div>
          </form>
        )}
      </div>
      {/* type */}
      <div className="space-y-5">
        <h1 className="text-lg font-bold">Property Type</h1>
        <div className="flex gap-4 flex-wrap">
          {property_type_items.map((item) => (
            <Button
              onClick={() => {
                if (item.value === "ANY") {
                  setSelected((prev) => ({ ...prev, type: [] }));
                  remove("type");
                  return;
                }

                let a = selected.type;
                if (selected.type.some((v) => v === item.value)) {
                  a = selected.type.filter((v) => v !== item.value);

                  setSelected((prev) => ({
                    ...prev,
                    type: a,
                  }));

                  if (a.length) {
                    concat("type", a.join("|"));
                  } else {
                    remove("type");
                  }
                } else {
                  a.push(item.value);
                  setSelected((prev) => ({
                    ...prev,
                    type: a,
                  }));
                  concat("type", a.join("|"));
                }
              }}
              key={item.name}
              className="rounded-full"
              variant={
                !selected.type.length && item.value === "ANY"
                  ? "default"
                  : selected.type.some((v) => v === item.value)
                  ? "default"
                  : "outline"
              }
            >
              {item.name}
            </Button>
          ))}
        </div>
      </div>

      {/* amenities */}
      <div className="space-y-5">
        <h1 className="text-lg font-bold">Amenities</h1>
        <div className="flex gap-3 flex-wrap">
          {amenities_items.map((item) => (
            <Button
              onClick={() => {
                if (item.value === "ANY") {
                  setSelected((prev) => ({ ...prev, amenities: [] }));
                  remove("am");
                  return;
                }

                let a = selected.amenities;
                if (selected.amenities.some((v) => v === item.value)) {
                  a = selected.amenities.filter((v) => v !== item.value);

                  setSelected((prev) => ({
                    ...prev,
                    amenities: a,
                  }));

                  if (a.length) {
                    concat("am", a.join("|"));
                  } else {
                    remove("am");
                  }
                } else {
                  a.push(item.value);
                  setSelected((prev) => ({
                    ...prev,
                    amenities: a,
                  }));
                  concat("am", a.join("|"));
                }
              }}
              key={item.name}
              className="rounded-full"
              variant={
                !selected.amenities.length && item.value === "ANY"
                  ? "default"
                  : selected.amenities.some((v) => v === item.value)
                  ? "default"
                  : "outline"
              }
            >
              {item.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
