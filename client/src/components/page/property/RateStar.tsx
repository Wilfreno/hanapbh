import { cn } from "@/lib/utils";
import { Star, StarHalf } from "lucide-react";

export default function RateStar({rating}: {rating: number}) {
  return (
    <div className="flex space-x-1">
      {Array.from({
        length: 5,
      }).map((_, index) =>
        Math.floor(rating!) === index + 1 ? (
          Math.floor(rating!) !== rating! ? (
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
              index + 1 < rating!
                ? "fill-primary"
                : "stroke-muted-foreground"
            )}
          />
        )
      )}
    </div>
  );
}
