import LoadingSvg from "@/components/svg/LoadingSvg";
import { cn } from "@/lib/utils";
import { Map, MapProps, useApiIsLoaded } from "@vis.gl/react-google-maps";
import { PropsWithChildren } from "react";
export default function MapProvider(props: PropsWithChildren<MapProps>) {
  const is_loaded = useApiIsLoaded();

  return is_loaded ? (
    <Map
      restriction={{
        latLngBounds: {
          north: 21.1321,
          south: 4.22599,
          west: 114.095,
          east: 128.604,
        },
        strictBounds: true,
      }}
      mapTypeControl={false}
      fullscreenControl={false}
      clickableIcons={false}
      disableDefaultUI={true}
      // draggableCursor="pointer"
      gestureHandling="greedy"
      mapId="34e1e36c06b5ac7a"
      defaultZoom={17}
      className={cn(      
        "w-full h-full outline-none focus-visible:ring-0 focus-visible:border-none rounded-lg",
        props.className
      )}
      {...props}
    >
      {props.children}
    </Map>
  ) : (
    <LoadingSvg className="h-1/5 w-auto fill-primary self-center justify-self-center" />
  );
}
