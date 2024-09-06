"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function useSearchParamsGenerator() {
  const search_params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  return {
    concat: (key: string, value: string) => {
      let params = "";
      if (search_params.has(key)) {
        search_params.forEach((v, k) => {
          if (k !== key) params += "&" + k + "=" + v;
        });

        router.replace(
          pathname + "?" + (params + "&" + key + "=" + value).replace("&", "")
        );
        return;
      }

      params = search_params.size
        ? search_params.toString() + "&" + key + "=" + value
        : key + "=" + value;

      router.replace(pathname + "?" + params);
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
