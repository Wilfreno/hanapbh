import { Button } from "@/components/ui/button";
import { Property } from "@/lib/types/data-type";
import { cn } from "@/lib/utils";
import { CircleAlert, Star, StarHalf } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PropertyHeader({
  property,
  is_loading,
}: {
  property?: Property;
  is_loading: boolean;
}) {
  const router = useRouter();

  return (
    <header className="grid w-full">
      <Button
        size="sm"
        className="justify-self-end"
        onClick={() => router.back()}
      >
        Go Back
      </Button>
      <div className="space-y-4">
        <span className="space-y-1">
          <h1
            className={cn(
              "text-3xl font-bold",
              is_loading && "animate-pulse bg-muted rounded-lg w-1/2 h-10"
            )}
          >
            {property?.name}
          </h1>
          <h2
            className={cn(
              "text-muted-foreground",
              is_loading && "animate-pulse bg-muted rounded-lg w-1/3 h-6"
            )}
          >
            {property?.address.vicinity}
          </h2>
        </span>
        <div className="flex items-center space-x-4 font-medium">
          <div className="flex space-x-1">
            {Array.from({
              length: 5,
            }).map((_, index) =>
              Math.floor(property?.rating!) === index + 1 ? (
                Math.floor(property?.rating!) !== property?.rating! ? (
                  <span key={index} className="relative">
                    <StarHalf className="fill-primary h-5 w-auto stroke" />
                    <Star className="absolute h-5 w-auto top-0 left-0" />
                  </span>
                ) : (
                  <Star key={index} className="fill-primary h-5 w-auto" />
                )
              ) : (
                <Star
                  key={index}
                  className={cn(
                    "h-5 w-auto  fill-muted",
                    index + 1 < property?.rating!
                      ? "fill-primary"
                      : "stroke-muted-foreground"
                  )}
                />
              )
            )}
          </div>
          <p className="flex">
            <span
              className={cn(
                is_loading &&
                  "w-8 h-6 bg-muted animate-pulse rounded-lg text-center"
              )}
            >
              {property?.rating!}
            </span>
            {"("}
            <span
              className={cn(
                is_loading &&
                  "w-8 h-6 bg-muted animate-pulse rounded-lg text-center"
              )}
            >
              {property?.reviews.length}
            </span>
            reviews {")"}
          </p>
          {property?.provider === "DB" && <CircleAlert className="h-4" />}
        </div>
      </div>
    </header>
  );
}
