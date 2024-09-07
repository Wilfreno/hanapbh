import { Property } from "@/lib/types/data-type";
import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import Link from "next/link";
import CustomImage from "./CustomImage";
import { usePathname } from "next/navigation";

export default function PropertyCard({ property }: { property: Property }) {
  const pathname = usePathname();
  return (
    <Link
      href={
        "/property/@" +
        property.name.replaceAll(" ", "-").toLowerCase() +
        "?from=" +
        pathname
      }
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="space-y-2 cursor-pointer pb-10 px-4"
      >
        <div className="aspect-square w-full h-auto relative">
          <CustomImage
            photo={property.photos[0]}
            provider={property.provider}
          />
        </div>
        <div className="px-1 space-y-10">
          <div className="space-y-1">
            <h1 className="font-bold truncate">{property.name}</h1>
            <h2 className="truncate text-xs text-muted-foreground">
              {property.address.vicinity}
            </h2>
          </div>
          <div className="text-sm font-semibold flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <MapPin className="h-4" />
              <p>{property.distance.toFixed(2)} m</p>
            </span>
            <span className="flex items-center space-x-1">
              <Star className="h-4 fill-primary" />
              <p>3.5</p>
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
