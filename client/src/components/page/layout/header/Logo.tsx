import HanapBHLogo from "@/components/svg/HanapBHLogo";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href={"/nearby"}
      className="flex space-x-5 items-center whitespace-nowrap w-fit"
    >
      <HanapBHLogo className="h-6 w-auto fill-primary" />
      <h1 className="hidden lg:inline-flex text-lg font-bold italic">
        Hanap BH
      </h1>
    </Link>
  );
}
