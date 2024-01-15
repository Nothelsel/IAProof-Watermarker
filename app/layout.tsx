import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';
import StarsCanvas from "@/components/main/StarsBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://filigran.seb2dev.com"),
  title: "Filigran - Sécurisez vos images avec un filigrane personnalisé",
  description: "Protégez vos images contre l'utilisation non autorisée avec Filigran, l'outil de filigranage intuitif et robuste créé par Sébastien Drouot, alias Seb2Dev. Utilisez des filigranes personnalisés pour ajouter une couche de sécurité et maintenir la confidentialité de vos créations visuelles.",
  keywords: [
    "Filigrane", "Générateur de filigrane", "Sécurité d'image", "Confidentialité", 
    "Développeur Fullstack", "Développement Backend", "Développement Frontend", 
    "Angular", "Freelance", "Seb2Dev"
  ],
  openGraph: {
    title: "Filigran - Générateur de filigrane avancé par Seb2Dev",
    description: "Filigran aide les créateurs à protéger leurs images avec des filigranes personnalisés et résistants à l'IA, conçus pour les professionnels et les passionnés.",
    images: [
      {
        url: "https://filigran.seb2dev.com/OpenGraph.png",
        width: 1200,
        height: 630,
        alt: "Aperçu de Filigran - Générateur de filigrane",
      },
    ],
    siteName: "Filigran",
  },
  twitter: {
    site: "@seb2dev_",
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-black overflow-y-scroll overflow-x-hidden`}>
        <StarsCanvas />
        <Navbar />
        {children}
        
        <Footer />
      </body>
    </html>
  );
}

