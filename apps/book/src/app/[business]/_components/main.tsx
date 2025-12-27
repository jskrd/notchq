import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Main({ children }: Props): ReactNode {
  return <main className="container mx-auto">{children}</main>;
}
