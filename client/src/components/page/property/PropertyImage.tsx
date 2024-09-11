import CustomImage from "../CustomImage";
import { Bookmark, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Property } from "@/lib/types/data-type";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function PropertyImage({
  property,
  is_loading,
}: {
  property?: Property;
  is_loading: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className={cn("aspect-video w-auto h-[70dvh] overflow-hidden", is_loading && "bg")}>
        <CustomImage
          photo={property?.photos ? property?.photos[0] : null}
          provider={property?.provider}
        />
      </div>
      <div className="flex items-center self-end gap-8">
        <Link
          href={"/map/" + property?.id}
          as={"/map/" + property?.id}
          prefetch
        >
          <Button variant="secondary" className="gap-1">
            <span>See Map</span>
            <Map className="h-4" />
          </Button>
        </Link>
        <Button size="lg" className="w-fit  gap-2">
          <span className="text-lg   font-bold">Book Now </span>
          <Bookmark className="h-full" />
        </Button>
      </div>
    </div>
  );
}
