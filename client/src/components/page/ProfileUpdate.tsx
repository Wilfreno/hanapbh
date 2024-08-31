"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Camera, UserRound, X } from "lucide-react";
import { Button } from "../ui/button";
import { UploadthingButton } from "../utils/UploadthingButton";
import { cn } from "@/lib/utils";

export default function ProfileUpdate() {
  const [image_url, setImageUrl] = useState("");

  const user_new = useSearchParams().get("new");
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useSession();
  useEffect(() => {});

  return (
    <Dialog open={!!user_new && !!data && !!data.user.photo}>
      <DialogContent className="space-y-10">
        <DialogHeader>
          <DialogTitle>Update your Profile Photo</DialogTitle>
        </DialogHeader>
        <div className="mx-auto space-y-4 grid place-items-center">
          <Avatar className="aspect-square h-auto w-[15vw]">
            <AvatarImage src={image_url} />
            <AvatarFallback>
              <UserRound className="w-1/2 stroke-muted-foreground h-auto  " />
            </AvatarFallback>
          </Avatar>
          <UploadthingButton
            endpoint="imageUploader"
            appearance={{
              button: cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                "text-primary underline-offset-4 hover:underline",
                "bg-background focus-within:ring-0 focus-within:ring-offset-0"
              ),
              allowedContent: "hidden",
            }}
            content={{
              button({ ready }) {
                if (ready) return <span>Upload Photo</span>;
              },
            }}
          />
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="secondary"> Not now</Button>
          <Button> Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
