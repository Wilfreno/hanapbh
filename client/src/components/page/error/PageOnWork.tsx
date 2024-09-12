import { Snail } from "lucide-react";

export default function PageOnWork({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <main className="w-full h-full grid place-items-center text-muted-foreground">
      <div className="space-y-2 grid justify-items-center gap-8">
        <span className="grid place-items-center">
          <Snail className="w-24 h-auto stroke-1 stroke-muted-foreground" />
          <p>Page still on working progress</p>
          <p>Nothing to see here</p>
        </span>
        {children}
      </div>
    </main>
  );
}
