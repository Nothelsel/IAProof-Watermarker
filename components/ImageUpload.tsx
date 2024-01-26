import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';


type ImageUploadProps = {
    onImageUpload: (image: string, name: string) => void;
};

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
    const [image, setImage] = useState(null as string | null);


    const readFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Seuls les fichiers image sont acceptés');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            setImage(e.target?.result as string);
            const fileNameWithoutExtension = file.name.split('.').slice(0, -1).join('.');
            onImageUpload(e.target?.result as string, fileNameWithoutExtension);
        };
        reader.readAsDataURL(file);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            readFile(file);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            readFile(file);
        }
    };

    return (
        <div className="max-w-xl bg-gray-800 p-4 rounded-lg">
            <label className="flex justify-center w-full h-32 px-4 transition bg-gray-700 border-2 border-gray-500 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
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
            <ToastContainer
                position="bottom-left"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </div>
    );

};

export default ImageUpload;
