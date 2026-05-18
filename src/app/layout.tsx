import type { Metadata, Viewport } from "next";
import { Source_Serif_4 } from "next/font/google";
import "./globals.css";
import TabBar from "@/components/TabBar";
import InstallPrompt from "@/components/InstallPrompt";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["900"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "everyone-prays",
  description: "개인용 기도 기록 & 알람 앱",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "everyone-prays",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FFF9F5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={sourceSerif.variable}>
      <body>
        <ServiceWorkerRegister />
        <InstallPrompt />
        <main>{children}</main>
        <TabBar />
      </body>
    </html>
  );
}

