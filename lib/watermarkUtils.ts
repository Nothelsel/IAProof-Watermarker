import ColorThief from 'colorthief';
import seedrandom from 'seedrandom';
import { toast } from 'react-toastify';
import * as Piexif from "piexifjs";

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

export const downloadImage = async (watermarkedImage: string, removeMetadata: boolean) => {
    let image = watermarkedImage;
    if (removeMetadata) {
        image = await deleteMetadata(watermarkedImage);
    }
    const link = document.createElement("a");
    link.href = image;
    link.setAttribute("download", "watermarked-image.png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const deleteMetadata = async (image: string): Promise<string> => {
    if (isJpg(image)) {
        return await deleteExifData(image);
    } else if (isPng(image)) {
        return deletePngChunks(image);
    } else {
        toast.error('Le format de l\'image n\'est pas supporté, seuls les images JPG sont supportées pour le moment.');
        return image;
    }
};

const deleteExifData = async (image: string): Promise<string> => {
    try {
        const exifObj = { "0th": {}, "Exif": {}, "GPS": {}, "thumbnail": null };
        const exifbytes = Piexif.dump(exifObj);
        return Piexif.insert(exifbytes, image);
    } catch (error) {
        toast.error('Une erreur est survenue lors de la suppression des métadonnées de l\'image');
        return image;
    }
  
};

const deletePngChunks = async (image: string) => {
    try {
        toast.info('Seul les métadonnées EXIF sont supprimées pour le moment.');
        return image
    } catch (error) {
        toast.error('Une erreur est survenue lors de la suppression des métadonnées de l\'image');
        return image;
    }
};

const isJpg = (image: string) => {
    const extension = image.split('.').pop();
    return extension === 'jpg' || extension === 'jpeg';
}

const isPng = (image: string) => {
    const extension = image.split('.').pop();
    return extension === 'png';
}

export const applyRandomWatermark = async (image: string, noiseLevel: number, seed: string, iaProof: boolean, advancedMode: boolean, watermarkText: string, bySeb2dev: boolean) => {
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

            if (bySeb2dev) {
                const fontSize = 20;
                const font = 'sans-serif';
                const padding = 10;
                ctx.font = `${fontSize}px ${font}`;
                ctx.textAlign = 'right';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.fillText('Filgrane by Seb2dev', canvas.width - padding, canvas.height - padding);
            }

            resolve(canvas.toDataURL());
        };
        img.onerror = reject;
    });
};

export const randomizeSeed = () => {
    const length = 10;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};


