import { Filter, } from "lucide-react";
import { Button } from "@/components/ui/button";

import useMediaQuery from "../../../hooks/useMediaQuery";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../../ui/drawer";
import { ScrollArea } from "../../../ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../ui/dialog";
import FilterContent from "./FilterContent";

export default function PageFilter() {
  const on_desktop = useMediaQuery();


  return on_desktop ? (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="p-1">
          <Filter className="h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter By</DialogTitle>
        </DialogHeader>
        <FilterContent />
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="p-1">
          <Filter className="h-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filter by</DrawerTitle>
          <DrawerClose className="absolute top-0 right-0 w-full flex justify-end h-8"></DrawerClose>
        </DrawerHeader>
        <ScrollArea className="h-[80dvh]">
          <FilterContent />
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
