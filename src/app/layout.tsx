import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Pasindu Jayasundara | Portfolio",
  description: "Full-Stack Software Engineer & Microsoft Student Ambassador Portfolio",
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://db.onlinewebfonts.com/c/04e6981992c0e2e7642af2074ebe3901?family=Helvetica+Now+Display+Bold" />
      </head>
      <body className={`${inter.variable} antialiased font-body`} suppressHydrationWarning>
        <main>{children}</main>
        <footer className="theme-footer py-12 border-t text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Pasindu Jayasundara. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
