import PageOnWork from "@/components/page/error/PageOnWork";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function page() {
  return (
    <div className="w-screen h-dvh">
      <PageOnWork>
        <Link href="/nearby">
          <Button>Go Back</Button>
        </Link>
      </PageOnWork>
    </div>
  );
}
