import { cn } from "@repo/book/lib/cn";
import type { HTMLAttributes, PropsWithChildren, ReactNode } from "react";

type Props = PropsWithChildren<HTMLAttributes<HTMLButtonElement>> & {
  variant: "primary" | "secondary";
};

export function Button({ variant, children, ...props }: Props): ReactNode {
  const variants = {
    primary: "bg-blue-700 text-white hover:bg-blue-800",
    secondary: "bg-transparent text-blue-700 hover:bg-blue-50 ",
  };

  return (
    <button
      {...props}
      className={cn(
        "text-21! cursor-pointer rounded-full px-21 py-13 leading-21 transition-colors duration-50",
        variants[variant],
        props.className,
      )}
    >
      {children}
    </button>
  );
}
