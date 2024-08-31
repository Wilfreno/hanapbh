import React from "react";
import { UploadthingButton } from "./utils/UploadthingButton";

export default function UploadFiles() {
  return (
    <UploadthingButton
      className="ut-allowed-content:hidden"
      endpoint="imageUploader"
      onClientUploadComplete={(req) => console.log(req)}
      onBeforeUploadBegin={(file) => {
        console.log(file);
        return file;
      }}
    />
  );
}
