"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Navbar = () => {
  return (
    <div className="w-full h-[65px] bg-['#111'] fixed backdrop-blur-sm z-50 px-10">
      <div className="w-full h-full flex flex-row items-center justify-between m-auto pr-2.5 md:px-2.5">
        <a href="/" className="h-auto flex flex-row items-center">
          <Image src="/logolabel.svg" alt="logo" width={120} height={120} className="cursor-pointer hover:animate-slowspin" />
        </a>

        <div className="flex flex-row justify-center gap-5 md:justify-between">
          <Link href="/">
            <div className="bg-transparent padding-10 cursor-pointer bg-black hover:bg-[#2E2E2E] rounded-xl text-white py-2 px-5">
              Home
            </div>
          </Link>
          <div onClick={() => window.open("https://github.com/Nothelsel/IAProof-Watermarker")}
            className="z-[1] bg-transparent padding-10 cursor-pointer bg-black hover:bg-[#2E2E2E] rounded-xl text-white py-2 px-5">
            Github
          </div>
          <Link href="/about">
            <div className="bg-transparent padding-10 cursor-pointer bg-black hover:bg-[#2E2E2E] rounded-xl text-white py-2 px-5 whitespace-nowrap">
              About
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};


export default Navbar;
