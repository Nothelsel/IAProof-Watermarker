'use client';
import React, { useState } from "react";
import ImageUpload from "./ImageUpload";
import Watermarker from "./Watermarker";
import Image from "next/image";

const Banner = () => {
  const [uploadedImage, setUploadedImage] = useState(null as string | null);
  const [watermarkedImage, setWatermarkedImage] = useState(null as string | null);

  const handleImageUpload = (image:string) => {
    setUploadedImage(image);
    setWatermarkedImage(null); // Réinitialiser l'image filigranée
  };

  const handleWatermarkApplied = (image:string) => {
    setWatermarkedImage(image); // Mettre à jour avec l'image filigranée
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setWatermarkedImage(null);
  };

  const handleDownloadImage = () => {
    const link = document.createElement("a");
    link.href = watermarkedImage || uploadedImage || "";
    link.setAttribute("download", "watermarked-image.png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  return (
    <div className="flex flex-row items-center justify-center px-20 z-[20] min-h-screen">
      <div className="flex flex-col justify-center text-center">
        {uploadedImage && (
          <div className="relative max-w-2xl mt-4">
            <div className="absolute top-0 right-0 p-2">
              <button onClick={handleRemoveImage} className="text-white bg-red-600 hover:bg-red-700 rounded-full p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="absolute top-10 right-0 p-2">
              <button onClick={handleDownloadImage} className="text-white bg-blue-600 hover:bg-blue-700 rounded-full p-1">
                  <Image src="/download.svg" height={25} width={25}  alt="download" />
                </button>
            </div>
            <img src={watermarkedImage || uploadedImage} alt="Uploaded" className="rounded-lg bg-gray-700 border border-gray-500" />
            <Watermarker base64Image={uploadedImage} onWatermarkApplied={handleWatermarkApplied} />
          </div>
        )}
        {!uploadedImage && (
          <ImageUpload onImageUpload={handleImageUpload} />
        )}
      </div>
    </div>
  );
};

export default Banner;
