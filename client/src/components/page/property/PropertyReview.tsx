import useUserLocation from "@/components/hooks/useUserLocation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Property } from "@/lib/types/data-type";
import { useQuery } from "@tanstack/react-query";
import { User } from "lucide-react";
import { useParams } from "next/navigation";
import RateStar from "./RateStar";

export default function PropertyReview() {
  const user_location = useUserLocation();
  const params = useParams<{ id: string }>();
  const { data } = useQuery<Property>({
    enabled: !!user_location,
    queryKey: ["property", params.id, user_location],
  });

  return (
    <div className="grid gap-8 w-full">
      <h1 className="text-2xl font-bold">Reviews</h1>
      <div className="grid gap-10 w-full">
        {data?.reviews.map((review, index) => (
          <div key={index} className="grid gap-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={review.reviewer.photo?.url} />
                <AvatarFallback>
                  <User className="h-full" />
                </AvatarFallback>
              </Avatar>
              <div className="w-full">
                <span className="flex items-center justify-between">
                  <p className="font-semibold">{review.reviewer.first_name}</p>
                  <span className="ml-auto">
                    <RateStar rating={review.rate} />
                  </span>
                </span>
                <p className="text-sm text-muted-foreground font-medium">
                  {review.relative_time_description}
                </p>
              </div>
            </div>
            <p className="text-muted-foreground  ">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
