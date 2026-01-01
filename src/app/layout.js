import Providers from './providers';
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
});

export const metadata = {
	title: "JupiNext",
	description: "JupiNext - Where the Next Begins",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.variable} antialiased`}>
				<Providers>
					{children}
				</Providers>
			</body>
		</html>
	);
}
