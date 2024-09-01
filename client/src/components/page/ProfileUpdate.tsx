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
import useHTTPRequest from "../hooks/useHTTPRequest";
import { Photo } from "@/lib/types/data-type";
import { toast } from "sonner";

export default function ProfileUpdate() {
  const [photo_url, setPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const user_new = useSearchParams().get("new");
  const pathname = usePathname();
  const router = useRouter();
  const { data, update } = useSession();
  const http_request = useHTTPRequest();
  return (
    <Dialog open={!!user_new && !!data && !!data.user.photo}>
      <DialogContent className="space-y-10">
        <DialogHeader>
          <DialogTitle>Update your Profile Photo</DialogTitle>
        </DialogHeader>
        <div className="mx-auto space-y-4 grid place-items-center">
          <Avatar className="aspect-square h-auto w-[15vw] border-primary">
            <AvatarImage src={photo_url} />
            <AvatarFallback>
              <UserRound className="w-1/2 stroke-muted-foreground h-auto  " />
            </AvatarFallback>
          </Avatar>
          <UploadthingButton
            endpoint="imageUploader"
            appearance={{
              //   container: "ut-uploading:bg-primary",
              button: cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                " underline-offset-4 text-primary ",
                "bg-background focus-within:ring-0 focus-within:ring-offset-0 after:ut-uploading:bg-muted-foreground ",
                !uploading && "hover:underline"
              ),
              allowedContent: "hidden",
            }}
            content={{
              button({ ready, isUploading }) {
                if (photo_url) return <span>Change Photo</span>;

                let e = <span>Upload Photo</span>;
                if (isUploading)
                  e = <span className="z-50 text-primary">Uploading...</span>;

                if (!ready) e = <span>...</span>;

                return e;
              },
            }}
            onClientUploadComplete={(response) => {
              setPhotoUrl(response[0].url);
              setUploading(false);
            }}
            onUploadError={(e) => {
              toast(e.message);
            }}
            onUploadBegin={() => setUploading(true)}
          />
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="secondary" onClick={() => router.replace(pathname)}>
            Not now
          </Button>
          <Button
            disabled={!photo_url}
            onClick={async () => {
              const {
                data: photo,
                status,
                message,
              } = await http_request.PATCH("/v1/user/photo", {
                id: data?.user.id,
                photo: { url: photo_url } satisfies Photo,
              });
              if (status !== "CREATED") {
                toast.warning(message);
                return;
              }
              await update({ photo: photo as Photo });
              router.replace(pathname);
            }}
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
