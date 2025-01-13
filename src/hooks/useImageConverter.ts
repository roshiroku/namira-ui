import { useMemo } from 'react';
import { ImageFormat } from '../enums/ImageFormat';

interface ConversionOptions {
  format?: ImageFormat;
  quality?: number; // Quality (0.0 to 1.0) for image/jpeg and image/webp
}

const useImageConverter = () => {
  const { canvas, ctx } = useMemo(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas context.');
    }

    return { canvas, ctx };
  }, []);

  const getImageName = (image: ImageInput, format?: ImageFormat): string => {
    let name = 'converted-image';

    if (typeof image === 'string') {
      const segments = image.split('/');
      name = segments.pop()?.split('.').slice(0, -1).join('.') || 'converted-image';
    } else if (image instanceof File || 'name' in image) {
      name = image.name.split('.').slice(0, -1).join('.') || 'converted-image';
    }

    const ext = format?.split('/')[1] || 'png';
    return `${name}.${ext}`;
  };

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

  return convertImages;
};

export default useImageConverter;
