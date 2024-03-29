import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { dir } from 'i18next'
import { languages } from '../i18n/settings'
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
    card: "summary_large_image",
    site: "@seb2dev_",
    creator: "@seb2dev_",
    title: "Filigran - Générateur de filigrane avancé par Seb2Dev",
    description: "Filigran aide les créateurs à protéger leurs images avec des filigranes personnalisés et résistants à l'IA, conçus pour les professionnels et les passionnés.",
    images: "https://filigran.seb2dev.com/OpenGraph.png",
  },
};

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}


export default function RootLayout({
  children,
  params: {
    lng
  }
}: {
  children: React.ReactNode,
  params: {
    lng: string
  }
}) {
  return (
    <html lang={lng} dir={dir(lng)}>
      <body className={`${inter.className} bg-black overflow-y-scroll overflow-x-hidden`}>
        <StarsCanvas />
        <Navbar params={{ lng }} />  
        {children}
        <Footer />
        <script defer src="https://a.guillaume.engineer/script.js" data-website-id="74b92240-bea4-4769-bf4e-e8ef1a8d302e" data-cache="true" data-domains="filigran.seb2dev.com"></script>
      </body>
    </html>
  );
}

