import Card from "@repo/book/app/[business]/_components/card";
import Cards from "@repo/book/app/[business]/_components/cards";
import type { ReactNode } from "react";

export default function Skeleton(): ReactNode {
  return (
    <Cards>
      {[...Array(3)].map((_, i) => (
        <Card key={i} />
      ))}
    </Cards>
  );
}
