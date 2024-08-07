"use client";
import useHTTPRequest from "@/components/hooks/useHTTPRequest";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Lodging } from "@/lib/types/data-type";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function OwnedLodging() {
  const places_api_key = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  if (!places_api_key)
    throw new Error(
      "NEXT_PUBLIC_GOOGLE_PLACES_API_KEY is missing from your .env.local file"
    );

  const [lodgings, setLodgings] = useState<Lodging[]>([]);

  const http_request = useHTTPRequest();
  const { data } = useSession();

  useEffect(() => {
    if (!data) return;
    async function getLodging() {
      const { data: lodging_data } = await http_request.GET(
        "/v1/user/" + data?.user.id + "/lodging"
      );

      setLodgings(lodging_data as Lodging[]);
    }
    getLodging();
  }, [data]);

  return (
    <Card className="h-fit w-[60vw]">
      <CardHeader>
        <CardTitle>Owned Lodgings</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[50dvh] relative">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky top-0 text-center bg-background font-bold z-10">
                  Image
                </TableHead>
                <TableHead className="sticky top-0 text-center bg-background font-bold">
                  Name
                </TableHead>
                <TableHead className="sticky top-0 text-center bg-background font-bold">
                  Address
                </TableHead>
                <TableHead className="sticky top-0 text-center bg-background font-bold">
                  Rating
                </TableHead>
                <TableHead className="sticky top-0 text-center bg-background font-bold">
                  Date created
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lodgings.map((lodging) => (
                <TableRow
                  key={lodging.id}
                  className="cursor-pointer rounded space-x-20"
                >
                  <TableCell>
                    {lodging.photos.length > 0 ? (
                      <Image
                        src={
                          "https://maps.googleapis.com/maps/api/place/photo?key=" +
                          places_api_key +
                          "&photo_reference=" +
                          lodging.photos[0].url +
                          "&maxwidth=" +
                          lodging.photos[0].width +
                          "&maxheight" +
                          lodging.photos[0].height
                        }
                        alt={lodging.name}
                        width={lodging.photos[0].width}
                        height={lodging.photos[0].height}
                        className="aspect-square w-auto h-[10dvh] object-cover rounded-xl"
                        priority
                      />
                    ) : (
                      <div className="aspect-square w-auto h-[10dvh] rounded-xl grid place-content-center font-bold text-center bg-muted p-2 text-muted-foreground">
                        <p>No Image</p>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="truncate w-[14vw]">{lodging.name}</p>
                  </TableCell>
                  <TableCell>
                    <p className="truncate w-[14vw]">
                      {lodging.address.vicinity}
                    </p>
                  </TableCell>
                  <TableCell className="text-center">3.4</TableCell>
                  <TableCell>
                    <p className="truncate">
                      {new Date(lodging.date_created).toDateString()}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
