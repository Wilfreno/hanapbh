import { ListOrdered } from "lucide-react";
import { Button } from "../../../ui/button";
import {
  DrawerTitle,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "../../../ui/drawer";
import useMediaQuery from "../../../hooks/useMediaQuery";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../ui/dialog";
import SortContent from "./SortContent";

export default function ListSort() {
  const on_desktop = useMediaQuery();

  return on_desktop ? (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="p-1">
          <ListOrdered className="h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold text-xl">Sort by</DialogTitle>
        </DialogHeader>
        <SortContent />
        <DialogFooter>
          <DialogClose asChild className="ml-auto">
            <Button className="font-medium">Ok</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="p-1">
          <ListOrdered className="h-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="font-bold text-xl">Sort by</DrawerTitle>
        </DrawerHeader>
        <SortContent />
      </DrawerContent>
    </Drawer>
  );
}
