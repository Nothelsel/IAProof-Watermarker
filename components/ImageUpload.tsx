import React, { useState } from 'react';


type ImageUploadProps = {
    onImageUpload: (image: string) => void;
};

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
    const [image, setImage] = useState(null as string | null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target?.result as string);
                onImageUpload(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="max-w-xl bg-gray-800 p-4 rounded-lg">
            <label className="flex justify-center w-full h-32 px-4 transition bg-gray-700 border-2 border-gray-500 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                <span className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="font-medium text-gray-300">
                        Déposez le fichier, ou
                        <span> </span>
                        <span className="text-blue-400 underline">parcourir</span>
                    </span>
                </span>
                <input type="file" name="file_upload" className="hidden" onChange={handleImageChange} />
            </label>
        </div>
    );

};

export default ImageUpload;