import Card from "@repo/book/app/[business]/_components/card";
import type { ReactNode } from "react";

export default function Skeleton(): ReactNode {
  return [...Array(3)].map((_, i) => <Card key={i} />);
}
