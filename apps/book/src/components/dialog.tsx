import Heading2 from "@repo/book/components/heading-2";
import { cn } from "@repo/book/lib/cn";
import { Dialog as DialogPrimitive } from "radix-ui";
import { ComponentPropsWithoutRef, HTMLAttributes, ReactNode } from "react";

export const Dialog = DialogPrimitive.Root;

export function DialogClose({
  children,
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close asChild>{children}</DialogPrimitive.Close>;
}

export function DialogContent({
  children,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 grid place-items-center overflow-y-auto bg-black/33 p-13">
        <DialogPrimitive.Content
          className="rounded-21 w-full max-w-lg bg-white p-21"
          {...props}
        >
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Overlay>
    </DialogPrimitive.Portal>
  );
}

export function DialogFooterActions({
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>): ReactNode {
  return (
    <div
      {...props}
      className={cn("flex justify-end space-x-21 pt-21", props.className)}
    >
      {children}
    </div>
  );
}

export function DialogTitle({
  children,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title asChild {...props}>
      <Heading2 className="mb-13">{children}</Heading2>
    </DialogPrimitive.Title>
  );
}

export function DialogTrigger({
  children,
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger asChild>{children}</DialogPrimitive.Trigger>;
}
