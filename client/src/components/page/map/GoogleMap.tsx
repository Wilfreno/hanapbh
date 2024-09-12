"use client";

import { APIProvider, MapProps } from "@vis.gl/react-google-maps";
import MapProvider from "./MapProvider";
import React, { PropsWithChildren } from "react";

export default function GoogleMap(props: PropsWithChildren<MapProps>) {
  const google_maps_api_key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!google_maps_api_key)
    throw new Error(
      "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing from your .env.local file"
    );
  return (
    <APIProvider apiKey={google_maps_api_key}>
      <MapProvider {...props}>{props.children}</MapProvider>
    </APIProvider>
  );
}
