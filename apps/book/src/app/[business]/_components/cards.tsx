import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Cards({ children }: Props): ReactNode {
  return (
    <div className="flex flex-wrap justify-center gap-21 px-21">{children}</div>
  );
}
