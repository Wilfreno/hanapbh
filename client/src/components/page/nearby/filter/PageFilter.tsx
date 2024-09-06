import { Filter } from "lucide-react";
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
  DialogClose,
  DialogContent,
  DialogFooter,
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
          <DialogTitle className="font-bold text-xl">Filter By</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60dvh]">
          <FilterContent />
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="ml-auto font-medium">Ok</Button>
          </DialogClose>
        </DialogFooter>
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
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle className="font-bold text-xl">Filter by</DrawerTitle>
          <DrawerClose asChild>
            <Button className="font-medium">Ok</Button>
          </DrawerClose>
        </DrawerHeader>
        <ScrollArea className="h-[80dvh] px-4">
          <FilterContent />
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
