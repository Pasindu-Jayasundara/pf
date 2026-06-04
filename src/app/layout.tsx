import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: "Pasindu Jayasundara | Portfolio",
  description: "Full-Stack Software Engineer & Microsoft Student Ambassador Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="stylesheet" href="https://db.onlinewebfonts.com/c/04e6981992c0e2e7642af2074ebe3901?family=Helvetica+Now+Display+Bold" />
      </head>
      <body className={`${inter.variable} antialiased font-body`}>
        <main>{children}</main>
        <footer className="py-12 border-t border-slate-800 text-center text-slate-400 text-sm bg-[#F2F2EE]">
          <p>© {new Date().getFullYear()} Pasindu Jayasundara. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
