import { cn } from "@repo/book/lib/cn";
import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

type Props = DetailedHTMLProps<
  HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>;

export default function Heading2({ children, ...props }: Props): ReactNode {
  return (
    <h2
      {...props}
      className={cn("text-21 leading-21 font-bold", props.className)}
    >
      {children}
    </h2>
  );
}
