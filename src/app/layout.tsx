import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MUN Study AI - İnteraktif Diplomasi Çalışma Koçu",
  description: "Arnavutluk ve Hırvatistan Model Birleşmiş Milletler (MUN) delegasyon konuşmaları için MiniMax M3 yapay zeka destekli çalışma uygulaması.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
