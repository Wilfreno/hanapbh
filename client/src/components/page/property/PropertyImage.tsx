import CustomImage from "../CustomImage";
import { Bookmark, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Property } from "@/lib/types/data-type";
import Link from "next/link";
import { cn } from "@/lib/utils";
import useUserLocation from "@/components/hooks/useUserLocation";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export default function PropertyImage() {
  const user_location = useUserLocation();
  const params = useParams<{ id: string }>();
  const { isLoading, data } = useQuery<Property>({
    enabled: !!user_location,
    queryKey: ["property", params.id, user_location],
  });

  return (
    <div className="flex flex-col gap-4">
      <div
        className={cn(
          "aspect-video w-auto h-[70dvh] overflow-hidden",
          isLoading && "bg"
        )}
      >
        <CustomImage
          photo={data?.photos ? data?.photos[0] : null}
          provider={data?.provider}
        />
      </div>
      <div className="flex items-center self-end">
        <Button size="lg" className="w-fit  gap-2">
          <span className="text-lg   font-bold">Book Now </span>
          <Bookmark className="h-full" />
        </Button>
      </div>
    </div>
  );
}
