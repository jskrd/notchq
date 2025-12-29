import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

type Props = DetailedHTMLProps<
  HTMLAttributes<HTMLParagraphElement>,
  HTMLParagraphElement
>;

export default function Paragraph({ children, ...props }: Props): ReactNode {
  return (
    <p className="text-21 mt-21 leading-34" {...props}>
      {children}
    </p>
  );
}
