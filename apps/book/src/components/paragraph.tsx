import { cn } from "@repo/book/lib/cn";
import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

type Props = DetailedHTMLProps<
  HTMLAttributes<HTMLParagraphElement>,
  HTMLParagraphElement
>;

export default function Paragraph({ children, ...props }: Props): ReactNode {
  return (
    <p {...props} className={cn("text-13! mt-13 leading-21", props.className)}>
      {children}
    </p>
  );
}
