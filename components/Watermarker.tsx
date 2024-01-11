'use client';
import React, { useState, useEffect } from 'react';
import ColorThief from 'colorthief';
import seedrandom from 'seedrandom';
import NextImage  from 'next/image';

const Watermarker = ({ base64Image, onWatermarkApplied }: { base64Image: string, onWatermarkApplied: (image: string) => void }) => {
    const [watermarkText, setWatermarkText] = useState('');
    const [watermarkedImage, setWatermarkedImage] = useState('');
    const [advancedMode, setAdvancedMode] = useState(false);
    const [noiseLevel, setNoiseLevel] = useState(0);
    const [seed, setSeed] = useState("");
    const [iaProof, setIaProof] = useState(false);
    const unmodifiedImage = base64Image;

    useEffect(() => {
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

        const applyRandomWatermark = (image: string, noiseLevel: number, seed: string, iaProof: boolean) => {
            if (advancedMode) seedrandom(seed, { global: true });

            return resizeImage(image, 800, 800).then(resizedImage => {
                return new Promise((resolve: (value: string) => void, reject) => {
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
                            const x = Math.random() * canvas.width;
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
                            ctx.translate(x, y);
                            ctx.rotate(angle);
                            ctx.fillText(watermarkText, 0, 0);
                            ctx.restore();
                        }
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        for (let i = 0; i < imageData.data.length; i += 4) {
                            const noise = advancedMode ? Math.random() * noiseLevel - noiseLevel / 2 : Math.random() * 50 - 25;
                            imageData.data[i] += noise; // Rouge
                            imageData.data[i + 1] += noise; // Vert
                            imageData.data[i + 2] += noise; // Bleu
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
            });
        };

        if (base64Image && watermarkText) {
            applyRandomWatermark(base64Image, noiseLevel, seed, iaProof).then((src) => {
                setWatermarkedImage(src);
                onWatermarkApplied(src.toString());
            });
        }
    }, [base64Image, watermarkText, advancedMode, iaProof, noiseLevel, onWatermarkApplied, seed]);

    const clearWatermark = () => {
        setWatermarkText('');
        setWatermarkedImage('');
        onWatermarkApplied(unmodifiedImage);
    }

    const regenerate = () => {
        if (base64Image && watermarkText) {
            // applyRandomWatermark(base64Image, noiseLevel, seed, iaProof).then((src) => {
            //     setWatermarkedImage(src);
            //     onWatermarkApplied(src.toString());
            // });
        }
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 text-white">
            <div className="flex items-center w-3/5 ">
                <input
                    type="text"
                    placeholder="Entrez votre filigrane (ex: confidentiel)"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    className="mb-4 p-2 w-full rounded border border-gray-300 dark:bg-gray-800 dark:text-white"
                />
                <button
                    onClick={() => regenerate()}
                    className="mb-4 p-2 rounded"
                >
                    🔄
                </button>
                <button
                    onClick={() => clearWatermark()}
                    className="mb-4"
                >
                    ❌
                </button>
            </div>
            <div className="space-y-2">
                <div className="flex items-center space-x-2 relative group">
                    <input
                        type="checkbox"
                        checked={iaProof}
                        onChange={(e) => setIaProof(e.target.checked)}
                    />
                    <span>IAProof</span>
                    <span className="relative flex justify-center items-center">
                        <NextImage src="/info-icon.svg" width={16} height={16} alt="Info" />
                        <span className="absolute w-64 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-4 py-2">
                            IAProof est une option qui rend le filigrane résistant à l&apos;IA.
                        </span>
                    </span>
                </div>
                <div className="flex items-center space-x-2 relative group">
                    <input
                        type="checkbox"
                        checked={advancedMode}
                        onChange={(e) => setAdvancedMode(e.target.checked)}
                    />
                    <span>Mode avancé</span>
                    <span className="relative flex justify-center items-center">
                        <NextImage src="/info-icon.svg" width={16} height={16} alt="Info" />
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
                        <div className="flex flex-col flex-grow">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={noiseLevel}
                                onChange={(e) => setNoiseLevel(parseInt(e.target.value))}
                                className="w-full"
                            />
                            <span>{noiseLevel}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="flex-none">Seed :</span>
                        <input
                            className='flex-grow p-1 rounded border dark:bg-gray-800 dark:text-white'
                            type="text"
                            value={seed}
                            onChange={(e) => setSeed(e.target.value)}
                        />
                    </div>
                </div>
            )}

        </div>
    );
};

export default Watermarker;
