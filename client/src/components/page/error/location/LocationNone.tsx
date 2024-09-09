import { MapPinXInside } from "lucide-react";

export default function LocationNone() {
  return (
    <main className="my-auto grid place-content-center space-y-5">
      <MapPinXInside className="h-auto w-[5vw] stroke-2 stroke-white mx-auto fill-muted-foreground" />
      <p className="text-center text-lg text-muted-foreground">
        Location detector is not supported in your browser no data will be
        displayed
      </p>
    </main>
  );
}
