import type { Metadata } from "next";
import localFont from "next/font/local";
import Providers from "./providers";
import "./globals.css";

const pressStart2P = localFont({
  src: "../../public/fonts/press-start-2p/PressStart2P.ttf",
  variable: "--font-press-start",
  display: "swap",
});

const dungGeunMo = localFont({
  src: "../../public/fonts/DungGeunMo/DungGeunMo.ttf",
  variable: "--font-dunggeunmo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EXPEDITION HUB — Hackathon Operations Portal",
  description: "재사용 가능한 해커톤 운영 포털",
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
