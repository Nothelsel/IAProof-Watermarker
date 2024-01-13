'use client';
import React, { useState, useEffect } from 'react';
import ColorThief from 'colorthief';
import seedrandom from 'seedrandom';
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

    const resizeImage = (image: string, maxWidth: number, maxHeight: number) => {
        return new Promise<string>((resolve, reject) => {
            const img = new Image();
            img.src = image;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                let { width, height } = img;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                if (ctx === null) return reject('Context is null');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL());
            };
            img.onerror = reject;
        });
    };

    const applyRandomWatermark = async (image: string, noiseLevel: number, seed: string, iaProof: boolean) => {
        if (advancedMode) seedrandom(seed, { global: true });

        const resizedImage = await resizeImage(image, 800, 800);
        return await new Promise((resolve: (value: string) => void, reject) => {
            const img = new Image();
            img.src = resizedImage;
            img.onload = () => {
                const colorThief = new ColorThief();
                const dominantColors = colorThief.getPalette(img);
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                if (ctx === null) return reject('Context is null');

                ctx.drawImage(img, 0, 0);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.textAlign = 'center';

                const watermarkCount = Math.floor(Math.random() * 5) + 5;

                for (let i = 0; i < watermarkCount; i++) {
                    const x_1 = Math.random() * canvas.width;
                    const y = Math.random() * canvas.height;
                    const angle = Math.random() * Math.PI * 2; // Angle aléatoire
                    const fontSize = Math.random() * 30 + 20;
                    const font = 'sans-serif'; // Police
                    const colorIndex = Math.floor(Math.random() * dominantColors.length);
                    const [r, g, b] = dominantColors[colorIndex];
                    const opacity = Math.random(); // Opacité aléatoire
                    ctx.fillStyle = `rgba(${r}, ${g}, ${b},  ${opacity})`; // Couleur aléatoire
                    ctx.font = `${fontSize}px ${font}`;
                    ctx.save();
                    ctx.translate(x_1, y);
                    ctx.rotate(angle);
                    ctx.fillText(watermarkText, 0, 0);
                    ctx.restore();
                }
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                for (let i_1 = 0; i_1 < imageData.data.length; i_1 += 4) {
                    const noise = advancedMode ? Math.random() * noiseLevel - noiseLevel / 2 : Math.random() * 50 - 25;
                    imageData.data[i_1] += noise; // Rouge
                    imageData.data[i_1 + 1] += noise; // Vert
                    imageData.data[i_1 + 2] += noise; // Bleu
                }
                ctx.putImageData(imageData, 0, 0);

                if (iaProof) {
                    const patternCanvas = document.createElement('canvas');
                    const patternCtx = patternCanvas.getContext('2d');
                    patternCanvas.width = 50;
                    patternCanvas.height = 50;
                    if (patternCtx === null) return reject('Context is null');
                    // Dessinez un motif de perturbation
                    patternCtx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                    patternCtx.beginPath();
                    patternCtx.arc(25, 25, 20, 0, 2 * Math.PI);
                    patternCtx.fill();


                    // Répétez le motif sur l'image principale
                    ctx.fillStyle = ctx.createPattern(patternCanvas, 'repeat') as CanvasPattern;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }

                resolve(canvas.toDataURL());
            };
            img.onerror = reject;
        });
    };


    useEffect(() => {

        if (base64Image && watermarkText) {
            const params = { image: base64Image, noiseLevel, seed, iaProof, advancedMode, watermarkText };
            setLastParams(params);
            applyRandomWatermark(base64Image, noiseLevel, seed, iaProof).then((src) => {
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
            applyRandomWatermark(unmodifiedImage, noiseLevel, seed, lastParams.iaProof).then((src) => {
                setWatermarkedImage(src);
                onWatermarkApplied(src.toString());
            })
        }
    }

    useEffect(() => {
        regenerate();
    }, [noiseLevel, seed, iaProof, advancedMode]);

    const randomizeSeed = () => {
        const length = 10;
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setSeed(result);
        regenerate();
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 text-white">
            <div className="flex items-center w-3/5 ">
                <input
                    type="text"
                    placeholder="Entrez votre filigrane (ex: confidentiel)"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    className="mb-4 mr-2 p-2 w-full rounded border border-gray-300 bg-gray-800 text-white placeholder-gray-400"
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
                            onClick={() => randomizeSeed()}
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
