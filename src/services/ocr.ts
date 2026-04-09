import { createWorker } from 'tesseract.js';

export const extractTextFromImage = async (imageFile: File | string) => {
  try {
    const worker = await createWorker('eng');
    const { data: { text } } = await worker.recognize(imageFile);
    await worker.terminate();
    return text;
  } catch (error) {
    console.error("OCR Error:", error);
    return "";
  }
};
