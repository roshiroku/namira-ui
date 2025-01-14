import { canvas, compareImages, ctx, getImageData, getImageName } from '../utils/image.utils';
import { ImageFormat } from '../enums/ImageFormat';

interface ConversionOptions {
  format?: ImageFormat;
  quality?: number; // Quality (0.0 to 1.0) for image/jpeg and image/webp
}

interface QualityConfig {
  maxDifference?: number;
  step?: number;
  initialQuality?: number;
}

const useImageConverter = () => {
  const convertImage = (image: ImageInput, options: ConversionOptions): Promise<ImageFile> => {
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
          const dataUrl = canvas.toDataURL(format, quality);
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

  const convertImages = async (
    input: ImageInput | ImageInput[],
    options: ConversionOptions = {}
  ): Promise<ImageFile[]> => {
    const images = Array.isArray(input) ? input : [input];
    return Promise.all(images.map((image) => convertImage(image, options)));
  };

  const detectQuality = async (
    image: ImageFile,
    format: ImageFormat,
    config: QualityConfig = {}
  ): Promise<number> => {
    const { maxDifference = 0.005, step = 0.01, initialQuality = 1 } = config;
    const imageData = await getImageData(image.src);
    let quality = initialQuality;
    let minQuality = initialQuality;

    while (quality >= 0) {
      const convertedImage = await convertImage(image, { format, quality });
      const difference = await compareImages(imageData, convertedImage.src);

      if (difference <= maxDifference) {
        minQuality = quality;
        quality = Math.round((quality - step) * 10_000) / 10_000; // Continue to check lower qualities
      } else {
        break; // Exit if difference exceeds maxDifference
      }
    }

    return minQuality;
  };

  return { convertImages, detectQuality };
};

export default useImageConverter;
