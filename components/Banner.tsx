'use client';
import React, { useState } from "react";
import ImageUpload from "./ImageUpload";
import Watermarker from "./Watermarker";
import Image from "next/image";
import { useTranslation } from "../app/i18n/client";

const Banner = ({ params: { lng } }: { params: { lng: string } }) => {
  const [uploadedImage, setUploadedImage] = useState(null as string | null);
  const [watermarkedImage, setWatermarkedImage] = useState(null as string | null);
  const [imageName, setImageName] = useState(null as string | null);
  const { t } = useTranslation(lng, 'banner')

  const handleImageUpload = (image: string, name: string) => {
    setUploadedImage(image);
    setWatermarkedImage(null);
    setImageName(name);
  };

  const handleWatermarkApplied = (image: string) => {
    setWatermarkedImage(image);
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setWatermarkedImage(null);
  };


  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${!uploadedImage ? 'md:space-y-24 space-y-10' : ''}`}>
      {!uploadedImage && (
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-white">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-300">
            {t('p1')} <span className="text-transparent font-semibold bg-clip-text bg-gradient-to-r from-purple-500 to-orange-400">
              {t('spanP1')}
            </span> {t('p1-2')}
          </p>
        </div>)}

      <div className="flex flex-row items-center justify-center z-[20]">
        <div className="flex flex-col justify-center text-center">
          {uploadedImage && (
            <div className="relative max-w-2xl mt-[5rem]">
              <div className="absolute top-0 right-0 p-2">
                <button onClick={handleRemoveImage} className="text-white bg-red-600 hover:bg-red-700 rounded-full border-2 border-white-500 p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <Image
                src={watermarkedImage || uploadedImage}
                alt="Uploaded"
                className="rounded-lg bg-gray-700 border border-gray-500 w-full h-auto object-contain"
                width={800}
                height={800}
              />
            </div>
          )}
          {!uploadedImage && (
            <ImageUpload onImageUpload={handleImageUpload} params={{ lng }}/>
          )}
        </div>
      </div>
      {uploadedImage && (<Watermarker base64Image={uploadedImage} imageName={imageName} onWatermarkApplied={handleWatermarkApplied}  params={{ lng }} />)}
      {!uploadedImage && (
        <div className="bg-gray-800 px-6 py-5 rounded-lg shadow-lg md:max-w-lg max-w-[22rem] mx-auto text-center">
          <h2 className="text-md text-white font-semibold mb-2">
            {t('h2')}
          </h2>
          <p className="text-gray-300 mb-2">
            {t('p2')}
          </p>
        </div>
      )}

    </div>
  );
}



export default Banner;
