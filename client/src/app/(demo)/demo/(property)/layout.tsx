import UserLocation from "@/components/page/UserLocation";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return <UserLocation>{children}</UserLocation>;
}
