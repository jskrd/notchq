import { cn } from "@repo/book/lib/cn";
import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

type Props = DetailedHTMLProps<
  HTMLAttributes<HTMLParagraphElement>,
  HTMLParagraphElement
>;

export default function Paragraph({ children, ...props }: Props): ReactNode {
  return (
    <p {...props} className={cn("text-21 mt-21 leading-34", props.className)}>
      {children}
    </p>
  );
}
