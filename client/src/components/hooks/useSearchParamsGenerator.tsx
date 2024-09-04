"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function useSearchParamsGenerator() {
  const search_params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  return {
    concat: (key: string, value: string) => {
      if (search_params.has(key)) {
        let params = "";
        search_params.forEach((v, k) => {
          if (k !== key) params += "&" + k + "=" + v;
        });

        router.replace(
          pathname + "?" + (params + "&" + key + "=" + value).replace("&", "")
        );
        return;
      }

      router.replace(
        pathname +
          "?" +
          (search_params.toString() + "&" + key + "=" + value).replace("&", "")
      );
    },
    remove: (key: string) => {
      if (!search_params.has(key)) return;

      let params = "";

      search_params.forEach((v, k) => {
        if (k !== key) params += "&" + k + "=" + v;
      });
      router.replace(pathname + "?" + params.replace("&", ""));
    },
  };
}
