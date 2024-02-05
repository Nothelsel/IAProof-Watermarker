import React, { useState, useEffect } from 'react';
import { applyRandomWatermark, randomizeSeed, downloadImage } from '@/lib/watermarkUtils';
import NextImage from 'next/image';
import { useTranslation } from "../app/i18n/client";

const Watermarker = ({ base64Image, imageName, onWatermarkApplied, params: { lng }  }: { base64Image: string, imageName: string|null, onWatermarkApplied: (image: string) => void,  params: { lng: string }  }) => {
    const [lastParams, setLastParams] = useState<{ image: string, noiseLevel: number, seed: string, iaProof: boolean, advancedMode: boolean, watermarkText: string } | null>(null);
    const [watermarkText, setWatermarkText] = useState('');
    const [watermarkedImage, setWatermarkedImage] = useState('');
    const [advancedMode, setAdvancedMode] = useState(false);
    const [noiseLevel, setNoiseLevel] = useState(50);
    const [removeMetadata, setRemoveMetadata] = useState(false);
    const [seed, setSeed] = useState("");
    const [iaProof, setIaProof] = useState(false);
    const [bySeb2dev, setBySeb2dev] = useState(true);
    const [imageResize, setImageResize] = useState(true);
    const unmodifiedImage = base64Image;
    const { t } = useTranslation(lng, 'watermarker')


    useEffect(() => {
        if (base64Image && watermarkText) {
            const params = { image: base64Image, noiseLevel, seed, iaProof, advancedMode, watermarkText };
            setLastParams(params);
            applyRandomWatermark(base64Image, noiseLevel, seed, iaProof, advancedMode, watermarkText, bySeb2dev).then((src) => {
                setWatermarkedImage(src);
                onWatermarkApplied(src.toString());
            });
        }
    }, [base64Image, watermarkText, noiseLevel, seed, iaProof, advancedMode]);

    const clearWatermark = () => {
        setWatermarkText('');
        setWatermarkedImage('');
        setAdvancedMode(false);
        setSeed('');
        onWatermarkApplied(unmodifiedImage);
    }

    const regenerate = () => {
        if (lastParams) {
            applyRandomWatermark(unmodifiedImage, noiseLevel, seed, lastParams.iaProof, advancedMode, watermarkText, bySeb2dev).then((src) => {
                setWatermarkedImage(src);
                onWatermarkApplied(src.toString());
            })
        }
    }

    useEffect(() => {
        regenerate();
    }, [noiseLevel, seed, iaProof, advancedMode, lastParams, bySeb2dev]);


    const handleRandomizeSeed = () => {
        const seed = randomizeSeed();
        setSeed(seed);
        regenerate();
    }

    const handleDownloadImage = () => {
        const imageToDownload = watermarkedImage !== "" ? watermarkedImage : unmodifiedImage;
        downloadImage(imageToDownload, removeMetadata, imageName);
    }


    return (
        <div className="flex flex-col items-center justify-center text-white px-4 py-5 mt-5 z-[20]">
            <div className="relative bg-gray-800 bg-opacity-75 rounded-lg shadow-lg px-4 py-5 mt-2 w-1/4 min-w-96">
                <div className="absolute bottom-0 right-0 mb-4 mr-4">
                    <button onClick={handleDownloadImage} className="text-white bg-blue-600 hover:bg-blue-700 rounded-full border-2 border-white-500 p-1">
                        <NextImage src="/download.svg" height={20} width={20} alt="download" />
                    </button>
                </div>
                <div className="flex items-center w-full">
                    <input
                        type="text"
                        placeholder={t('inputPlaceholder')}
                        value={watermarkText}
                        onChange={(e) => {
                            setWatermarkText(e.target.value);
                            if (e.target.value.length === 0) {
                                clearWatermark();
                            }
                        }}
                        className="mb-4 mr-2 p-2 w-full min-w-[8rem] rounded border border-gray-300 bg-gray-800 text-white placeholder-gray-400"
                    />
                    <button
                        onClick={() => regenerate()}
                        className="mb-4 p-2 rounded mr-2 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                    >
                        <NextImage src="/refresh.svg" width={24} height={24} alt="Refresh" className="hover:opacity-75" />
                    </button>
                    <button
                        onClick={() => clearWatermark()}
                        className="mb-4 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                    >
                        <NextImage src="/remove.svg" width={27} height={27} alt="Refresh" className="hover:opacity-75" />
                    </button>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center space-x-2 relative group">
                        <input
                            type="checkbox"
                            checked={iaProof}
                            onChange={(e) => setIaProof(e.target.checked)}
                            className="w-6 h-6 text-blue-500 rounded"
                        />
                        <span>IAProof</span>
                        <span className="relative flex justify-center items-center">
                            <NextImage src="/info-icon.svg" width={24} height={24} alt="Info" className="hover:opacity-75" />
                            <span className="absolute w-64 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-4 py-2">
                                {t('iaProofInfo')}
                            </span>
                        </span>
                    </div>
                    <div className="flex items-center space-x-2 relative group">
                        <input
                            type="checkbox"
                            checked={imageResize}
                            onChange={(e) => setImageResize(e.target.checked)}
                            className="w-6 h-6 text-blue-500 rounded"
                        />
                        <span>{t('imageResize')}</span>
                        <span className="relative flex justify-center items-center">
                            <NextImage src="/info-icon.svg" width={24} height={24} alt="Info" className="hover:opacity-75" />
                            <span className="absolute w-64 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-4 py-2">
                                {t('imageResizeInfo')}
                            </span>
                        </span>
                    </div>
                    <div className="flex items-center space-x-2 relative group w-2/3">
                        <input
                            type="checkbox"
                            checked={advancedMode}
                            onChange={(e) => setAdvancedMode(e.target.checked)}
                            className="w-6 h-6 text-blue-500 rounded"
                        />
                        <span>{t('advancedMode')}</span>
                        <span className="relative flex justify-center items-center">
                            <NextImage src="/info-icon.svg" width={24} height={24} alt="Info" className="hover:opacity-75" />
                            <span className="absolute w-64 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-4 py-2">
                                {t('advancedModeInfo')}
                            </span>
                        </span>
                    </div>
                </div>
            </div>

            {advancedMode && (
                <div className="bg-gray-800 bg-opacity-75 rounded-lg shadow-lg px-4 py-3 mt-4 w-1/4 min-w-96">
                    <div className="space-y-4 mt-2">
                        <div className="flex items-center space-x-2">
                            <span className="flex-none">{t('noiseLevel')}</span>
                            <div className="flex flex-row flex-grow items-center">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={noiseLevel}
                                    onChange={(e) => setNoiseLevel(parseInt(e.target.value))}
                                    className="w-full mr-2"
                                />
                                <span>{noiseLevel}</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 relative group">
                            <input
                                type="checkbox"
                                checked={removeMetadata}
                                onChange={(e) => setRemoveMetadata(e.target.checked)}
                                className="w-6 h-6 text-blue-500 rounded"
                            />
                            <span>{t('removeMetadata')}</span>
                            <span className="relative flex justify-center items-center">
                                <NextImage src="/info-icon.svg" width={24} height={24} alt="Info" className="hover:opacity-75" />
                                <span className="absolute w-64 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-4 py-2">
                                    {t('removeMetadataInfo')}
                                </span>
                            </span>
                        </div>
                        <div className="flex items-center space-x-2 relative group">
                            <input
                                type="checkbox"
                                checked={bySeb2dev}
                                onChange={(e) => setBySeb2dev(e.target.checked)}
                                className="w-6 h-6 text-blue-500 rounded"
                            />
                            <span>{t('bySeb2dev')}</span>
                            <span className="relative flex justify-center items-center">
                                <NextImage src="/info-icon.svg" width={24} height={24} alt="Info" className="hover:opacity-75" />
                                <span className="absolute w-64 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-4 py-2">
                                    {t('bySeb2devInfo')}
                                </span>
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="flex-none">{t('seed')}</span>
                            <input
                                className='flex-grow p-1 rounded border border-gray-300 bg-gray-800 text-white placeholder-gray-400'
                                type="text"
                                value={seed}
                                onChange={(e) => setSeed(e.target.value)}
                            />
                            <button
                                onClick={() => handleRandomizeSeed()}
                                className="p-2 rounded mr-2 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                            >
                                <NextImage src="/random.svg" width={24} height={24} alt="Refresh" />
                            </button>
                        </div>
                    </div>
                </div>

            )}
        </div>
    );
};

export default Watermarker;
