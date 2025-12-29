import Paragraph from "@repo/book/components/paragraph";
import type { Components } from "react-markdown";

export const markdownComponents: Components = {
  p: ({ children }) => <Paragraph>{children}</Paragraph>,
};
