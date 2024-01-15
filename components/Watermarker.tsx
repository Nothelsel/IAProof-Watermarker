'use client';
import React, { useState, useEffect } from 'react';
import { applyRandomWatermark, randomizeSeed } from '@/lib/watermarkUtils';
import NextImage from 'next/image';

const Watermarker = ({ base64Image, onWatermarkApplied }: { base64Image: string, onWatermarkApplied: (image: string) => void }) => {
    const [lastParams, setLastParams] = useState<{ image: string, noiseLevel: number, seed: string, iaProof: boolean, advancedMode: boolean, watermarkText: string } | null>(null);
    const [watermarkText, setWatermarkText] = useState('');
    const [watermarkedImage, setWatermarkedImage] = useState('');
    const [advancedMode, setAdvancedMode] = useState(false);
    const [noiseLevel, setNoiseLevel] = useState(50);
    const [seed, setSeed] = useState("");
    const [iaProof, setIaProof] = useState(false);
    const unmodifiedImage = base64Image;

    
    useEffect(() => {

        if (base64Image && watermarkText) {
            const params = { image: base64Image, noiseLevel, seed, iaProof, advancedMode, watermarkText };
            setLastParams(params);
            applyRandomWatermark(base64Image, noiseLevel, seed, iaProof, advancedMode, watermarkText).then((src) => {
                setWatermarkedImage(src);
                onWatermarkApplied(src.toString());
            });
        }
    }, [base64Image, watermarkText]);

    const clearWatermark = () => {
        setWatermarkText('');
        setWatermarkedImage('');
        onWatermarkApplied(unmodifiedImage);
    }

    const regenerate = () => {
        if (lastParams) {
            applyRandomWatermark(unmodifiedImage, noiseLevel, seed, lastParams.iaProof, advancedMode, watermarkText).then((src) => {
                setWatermarkedImage(src);
                onWatermarkApplied(src.toString());
            })
        }
    }

    useEffect(() => {
        regenerate();
    }, [noiseLevel, seed, iaProof, advancedMode]);


    const handleRandomizeSeed = () => {
        const seed = randomizeSeed();
        setSeed(seed);
        regenerate();
    }


    return (
        <div className="flex flex-col items-center justify-center p-4 text-white">
            <div className="flex items-center w-3/5">
                <input
                    type="text"
                    placeholder="Entrez votre filigrane (ex: confidentiel)"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
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
            <div className="space-y-2">
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
                            IAProof est une option qui rend le filigrane résistant à l'IA.
                        </span>
                    </span>
                </div>
                <div className="flex items-center space-x-2 relative group">
                    <input
                        type="checkbox"
                        checked={advancedMode}
                        onChange={(e) => setAdvancedMode(e.target.checked)}
                        className="w-6 h-6 text-blue-500 rounded"
                    />
                    <span>Mode avancé</span>
                    <span className="relative flex justify-center items-center">
                        <NextImage src="/info-icon.svg" width={24} height={24} alt="Info" className="hover:opacity-75" />
                        <span className="absolute w-64 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-4 py-2">
                            Le mode avancé vous permet de contrôler plus de paramètres pour le filigrane.
                        </span>
                    </span>
                </div>
            </div>
            {advancedMode && (
                <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                        <span className="flex-none">Niveau de bruit :</span>
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
                    <div className="flex items-center space-x-2">
                        <span className="flex-none">Seed :</span>
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
            )}

        </div>
    );
};

export default Watermarker;
