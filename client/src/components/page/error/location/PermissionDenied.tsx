import { MapPinOff } from "lucide-react";

export default function PermissionDenied() {
  return (
    <main className="my-auto grid place-content-center space-y-5">
      <MapPinOff className="h-auto w-[5vw] stroke-2 stroke-white mx-auto fill-muted-foreground" />
      <span className="text-lg text-muted-foreground text-center">
        <p>Location access is denied</p>
        <p>
          To continue using this site please allow it to access your location
        </p>
      </span>
    </main>
  );
}
