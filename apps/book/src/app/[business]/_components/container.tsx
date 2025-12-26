import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Container({ children }: Props): ReactNode {
  return (
    <div className="container mx-auto flex flex-wrap justify-center gap-21 px-21 pb-55">
      {children}
    </div>
  );
}
