"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useTranslation, changeLanguage } from "../app/i18n/client";
import { languages } from '../app/i18n/settings'

const Navbar = ({ params: { lng } }: { params: { lng: string } }) => {
  const { t } = useTranslation(lng, 'navbar')
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLanguageChange = (newLng: string) => {
    changeLanguage(newLng);
    setShowDropdown(false);
  };
  
  return (
    <div className="w-full h-[65px] bg-['#111'] fixed backdrop-blur-sm z-50 px-10">
      <div className="w-full h-full flex flex-row items-center justify-between m-auto pr-2.5 md:px-2.5">
        <a href={`/${lng}`} className="h-auto flex flex-row items-center">
          <Image src="/logolabel.svg" alt="logo" width={120} height={120} className="cursor-pointer hover:animate-slowspin" />
        </a>
        <div className="flex flex-row justify-center gap-5 md:justify-between">
          <Link href={`/${lng}`}>
            <div className="bg-transparent padding-10 cursor-pointer bg-black hover:bg-[#2E2E2E] rounded-xl text-white py-2 px-5">
              {t('home')}
            </div>
          </Link>
          <div onClick={() => window.open("https://github.com/Nothelsel/IAProof-Watermarker")}
            className="z-[1] bg-transparent padding-10 cursor-pointer bg-black hover:bg-[#2E2E2E] rounded-xl text-white py-2 px-5">
            Github
          </div>
          <Link href={`/${lng}/about`}>
            <div className="bg-transparent padding-10 cursor-pointer bg-black hover:bg-[#2E2E2E] rounded-xl text-white py-2 px-5 whitespace-nowrap">
              {t('about')}
            </div>
          </Link>
          <div className="h-auto flex flex-row items-center z-[20]">
            <Image src={`/${lng}.svg`} alt="flag" width={20} height={20} className="cursor-pointer" onClick={() => setShowDropdown(!showDropdown)} />
          </div>
          {showDropdown && (
            <div className="absolute top-full right-5 bg-['#111'] rounded shadow-lg text-white">
              {languages.filter((l) => lng !== l).map((l) => (
                <div key={l} className="cursor-pointer px-4 py-2 hover:bg-[#2E2E2E]" onClick={() => handleLanguageChange(l)}>
                  {l === 'en' ? 'English' : 'Français'}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default Navbar;
