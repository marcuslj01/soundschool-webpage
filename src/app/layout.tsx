import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "Soundschool - Premium Music Production Resources | MIDI Files, FLP Projects & Sample Packs",
  description:
    "Soundschool is your premier destination for high-quality music production resources. Download professional MIDI files, FLP projects, and sample packs to elevate your music production.",
  keywords:
    "music production, MIDI files, FLP projects, sample packs, music resources, soundschool, music production tools",
  authors: [{ name: "Soundschool" }],
  creator: "Soundschool",
  publisher: "Soundschool",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://soundschoolmidis.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Soundschool - Premium Music Production Resources",
    description:
      "Download professional MIDI files, FLP projects, and sample packs to elevate your music production.",
    url: "https://soundschoolmidis.com",
    siteName: "Soundschool",
    images: [
      {
        url: "/images/Hero.png",
        width: 1200,
        height: 630,
        alt: "Soundschool - Music Production Resources",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Soundschool - Premium Music Production Resources",
    description:
      "Download professional MIDI files, FLP projects, and sample packs to elevate your music production.",
    images: ["/images/Hero.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <AuthProvider>
          <div className="min-h-screen w-full overflow-x-hidden">
            <Navbar />
            <main className="w-full">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
