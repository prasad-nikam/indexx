import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Index — Your content, in context",
	description:
		"A personal space to discover, organize, and keep up with the things that matter.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>{children}</body>
		</html>
	);
}
