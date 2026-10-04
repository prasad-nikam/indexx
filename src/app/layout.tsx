import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store/provider";

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
			<body>
				<StoreProvider>{children}</StoreProvider>
			</body>
		</html>
	);
}
