import type { Metadata } from "next";
import "./globals.css";
import type { ReactNode } from "react";

export const metadata: Metadata = {
	title: "Book",
	description: "",
};

type RootLayoutProps = {
	children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps): ReactNode {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
