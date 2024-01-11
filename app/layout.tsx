import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StarsCanvas from "@/components/main/StarsBackground";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://seb2dev.com"
  ),
  title: "Filigran Seb2Dev",
  description: "Initialement developpé par Ibrahim Memon, modifié par Sébastien Drouot",
  keywords: ["Developer", "Portfolio", "Developer Portflio", "Sébastien Drouot", "Fullstack", "Backend", "Frontend", "Angular", "Freelance", "seb2dev.com", "seb2dev.fr", "seb2dev"],
  openGraph: {
    title: "Sébastien Drouot",
    description: "Software Engineer / Fullstack Developer",
    images: "/OpenGraph.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-[#111] overflow-y-scroll overflow-x-hidden`}>
        <StarsCanvas />
        <Navbar />
        {children}
      </body>
    </html>
  );
}

