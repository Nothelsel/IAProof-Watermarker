import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' })

// function hashText sha512
const hashText = (text: string): string => {
  const secret = process.env.SECRET_KEY;
  if (!secret) {
    throw new Error('SECRET_KEY is not defined');
  }
  const hash = crypto.createHmac('sha512', secret).update(text).digest('hex');
  return hash;
}

async function encodeImageWithText(imageBuffer: Buffer) {
  try {
    // const secretSignature = process.env.SECRET_SIGNATURE;
    // console.log('secretSignature:', secretSignature);
    // if (!secretSignature) {
    //   throw new Error('SECRET_SIGNATURE is not defined');
    // }
    // const textBuffer = Buffer.from(hashText(secretSignature), 'utf-8');
    // const compositedImage = steg.encode(textBuffer, imageBuffer);
    // return compositedImage;
    return imageBuffer;
  } catch (error) {
    console.error('Error processing the image:', error);
    throw error;
  }
}

export { hashText, encodeImageWithText };
