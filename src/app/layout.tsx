import type { Metadata } from "next";
import localFont from "next/font/local";
import Providers from "./providers";
import TopNav from "@/components/layout/TopNav";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const pressStart2P = localFont({
  src: "../../public/fonts/press-start-2p/PressStart2P.woff2",
  variable: "--font-press-start",
  display: "swap",
});

const dungGeunMo = localFont({
  src: "../../public/fonts/DungGeunMo/DungGeunMo.woff2",
  variable: "--font-dunggeunmo",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "EXPEDITION HUB — Hackathon Operations Portal",
  description: "재사용 가능한 해커톤 운영 포털",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", rel: "shortcut icon", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${pressStart2P.variable} ${dungGeunMo.variable} bg-dark-bg text-card-white font-dunggeunmo antialiased`}
      >
        <Providers>
          <div className="flex flex-col min-h-screen">
            <TopNav />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
