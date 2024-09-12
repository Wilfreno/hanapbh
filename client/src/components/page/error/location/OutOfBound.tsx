import { MapPinX } from "lucide-react";

export default function OutOfBound() {
  return (
    <main className="my-auto grid place-content-center space-y-5">
      <MapPinX className="h-auto w-[5vw] stroke-2 stroke-white mx-auto fill-muted-foreground" />
      <span className="text-center text-lg text-muted-foreground">
        <p>Looks like your trying to access the app outside the Philippines.</p>
        <p>Nothing wil be displayed but you can still use the search bar</p>
      </span>
    </main>
  );
}
