import { X } from "lucide-react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "./drawer";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog";

import { useIsMobile } from "@/hooks/use-mobile";

interface Props {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  withClose?: boolean;
}

export const ResponsiveModal = ({
  children,
  open,
  onOpenChange,
  title,
  withClose,
}: Props) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="mb-2">
            <DrawerTitle className="flex flex-row items-center justify-between w-full">
              {title ? title : <div />}
              {withClose && (
                <DrawerClose className="rounded-full size-8 border-none shadow-none">
                  <X />
                </DrawerClose>
              )}
            </DrawerTitle>
            <DrawerDescription className="hidden" />
          </DrawerHeader>
          <div className="flex flex-col gap-4 p-4 pt-1 overflow-y-auto max-h-[92vh]">
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-full sm:max-w-xl border-none overflow-y-auto max-h-[92vh]">
        <AlertDialogHeader className="mb-2">
          <AlertDialogTitle className="flex flex-row items-center justify-between w-full">
            {title ? title : <div />}
            {withClose && (
              <AlertDialogCancel className="rounded-full size-8 border-none shadow-none">
                <X />
              </AlertDialogCancel>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription className="hidden" />
        </AlertDialogHeader>
        {children}
      </AlertDialogContent>
    </AlertDialog>
  );
};
