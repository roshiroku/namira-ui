import { ImageFormat } from '../enums/ImageFormat';
import { canvas, ctx, getImageName } from './image.utils';

interface ConversionOptions {
  format?: ImageFormat;
  quality?: number; // Quality (0.0 to 1.0) for image/jpeg and image/webp
}

export const convertImage = (image: ImageInput, options: ConversionOptions): Promise<ImageFile> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    // Handle File, ImageFile, or URL
    if (typeof image === 'string') {
      img.src = image;
    } else if (image instanceof File) {
      const reader = new FileReader();
      reader.onload = () => (img.src = reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read the file.'));
      reader.readAsDataURL(image);
    } else {
      img.src = image.src;
    }

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing
      ctx.drawImage(img, 0, 0);

      const { format = ImageFormat.PNG, quality = 1.0 } = options;
      try {
        const dataUrl = canvas.toDataURL(format === ImageFormat.JPG ? ImageFormat.JPEG : format, quality);
        const convertedFile: ImageFile = {
          name: getImageName(image, format),
          type: format,
          size: Math.round((dataUrl.length * (3 / 4)) - (dataUrl.endsWith('==') ? 2 : 1)), // Estimate size
          src: dataUrl,
        };
        resolve(convertedFile);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error('Failed to load the image.'));
  });
};

export const convertImages = async (
  input: ImageInput | ImageInput[],
  options: ConversionOptions = {}
): Promise<ImageFile[]> => {
  const images = Array.isArray(input) ? input : [input];
  return Promise.all(images.map((image) => convertImage(image, options)));
};
