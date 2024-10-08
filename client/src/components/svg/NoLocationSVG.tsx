import { SVGProps } from "react";

export default function NoLocationSVG(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      width="800px"
      height="800px"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 8L14 12M14 8L10 12M19 10.2C19 14.1764 15.5 17.4 12 21C8.5 17.4 5 14.1764 5 10.2C5 6.22355 8.13401 3 12 3C15.866 3 19 6.22355 19 10.2Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
