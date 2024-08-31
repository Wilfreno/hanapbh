"use client";

import useHTTPRequest from "@/components/hooks/useHTTPRequest";
import { User } from "@/lib/types/data-type";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { username: string } }) {
  const [user, setUser] = useState<User>();

  const { data } = useSession();
  const http_request = useHTTPRequest();

  useEffect(() => {
    if (params.username === "@me") {
      setUser(data?.user);
      return;
    }
    async function getUser() {
      try {
        const { data, status } = await http_request.GET(
          "/v1/user/@" + params.username.substring(1)
        );

        if (status === "NOT_FOUND") notFound();

        setUser(data as User);
      } catch (error) {
        throw error;
      }
    }
  }, []);

  return <div>{user?.first_name}</div>;
}
