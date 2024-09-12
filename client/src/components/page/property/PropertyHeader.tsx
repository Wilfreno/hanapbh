import useUserLocation from "@/components/hooks/useUserLocation";
import { Button } from "@/components/ui/button";
import { Property } from "@/lib/types/data-type";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CircleAlert, Star, StarHalf } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import RateStar from "./RateStar";

export default function PropertyHeader() {
  const user_location = useUserLocation();
  const params = useParams<{ id: string }>();
  const from = useSearchParams().get("from");
  const { data } = useQuery<Property>({
    enabled: !!user_location,
    queryKey: ["property", params.id, user_location],
  });

  return (
    <header className="grid w-full">
      <Link href={from ? from : "/nearby"}>
        <Button
          size="sm"
          className="justify-self-end"
        >
          Go Back
        </Button>
      </Link>
      <div className="space-y-4">
        <span className="space-y-1">
          <h1
            className={cn(
              "text-3xl font-bold",
              !data && "animate-pulse bg-muted rounded-lg w-1/2 h-10"
            )}
          >
            {data?.name}
          </h1>
          <h2
            className={cn(
              "text-muted-foreground",
              !data && "animate-pulse bg-muted rounded-lg w-1/3 h-6"
            )}
          >
            {data?.address.vicinity}
          </h2>
        </span>
        <div className="flex items-center space-x-4 font-medium">
          <RateStar rating={data?.rating!}/>
          <p className="flex gap-1">
            <span
              className={cn(
                !data && "w-8 h-6 bg-muted animate-pulse rounded-lg text-center"
              )}
            >
              {data?.rating!}
            </span>
            {"("}
            <span
              className={cn(
                !data && "w-8 h-6 bg-muted animate-pulse rounded-lg text-center"
              )}
            >
              {data?.reviews.length}
            </span>
            reviews {")"}
          </p>
          {data?.provider === "DB" && <CircleAlert className="h-4" />}
        </div>
      </div>
    </header>
  );
}
