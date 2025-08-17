import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "myfooapp",
  description: "A PWA built with Next.js",
  manifest: "/manifest.json",
  icons: {
    icon: "/1.png",
    apple: "/2.png",
  },
};

// ✅ Move themeColor here
export const viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >
        {children}
      </body>
  </html>
);
}