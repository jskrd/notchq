import { cn } from "@repo/book/lib/cn";
import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

type Props = DetailedHTMLProps<
  HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>;

export default function Heading1({ children, ...props }: Props): ReactNode {
  return (
    <h1
      {...props}
      className={cn("text-34 leading-34 font-bold", props.className)}
    >
      {children}
    </h1>
  );
}
