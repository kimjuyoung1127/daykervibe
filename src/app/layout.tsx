import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Expedition Hub",
  description: "재사용 가능한 해커톤 운영 포털",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
