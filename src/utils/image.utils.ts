import { ImageFormat } from '../enums/ImageFormat';

export const { canvas, ctx } = (() => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error('Failed to get canvas context.');
  }

  return { canvas, ctx };
})();

export const getImageName = (image: ImageInput, format?: ImageFormat): string => {
  let name = 'image';

  if (typeof image === 'string') {
    const segments = image.split('/');
    name = segments.pop()?.split('.').slice(0, -1).join('.') || 'image';
  } else if (image instanceof File || 'name' in image) {
    name = image.name.split('.').slice(0, -1).join('.') || 'image';
  }

  const ext = format?.split('/')[1] || 'png';
  return `${name}.${ext}`;
};

export const getImageData = async (data: string | ImageData): Promise<ImageData> => {
  if (typeof data !== 'string') {
    return data;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = data;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      resolve(ctx.getImageData(0, 0, canvas.width, canvas.height));
    };
    img.onerror = () => reject(new Error('Failed to load image.'));
  });
};

export const compareImages = async (data1: string | ImageData, data2: string | ImageData): Promise<number> => {
  if (!data1 || !data2) {
    throw new Error('Both data inputs are required for comparison.');
  }

  try {
    const [imgData1, imgData2] = await Promise.all([getImageData(data1), getImageData(data2)]);

    if (imgData1.width !== imgData2.width || imgData1.height !== imgData2.height) {
      throw new Error('Images must have the same dimensions for comparison.');
    }

    const data1Pixels = imgData1.data;
    const data2Pixels = imgData2.data;

    // Calculate the pixel difference
    let diff = 0;
    for (let i = 0; i < data1Pixels.length; i += 4) {
      const rDiff = Math.abs(data1Pixels[i] - data2Pixels[i]);
      const gDiff = Math.abs(data1Pixels[i + 1] - data2Pixels[i + 1]);
      const bDiff = Math.abs(data1Pixels[i + 2] - data2Pixels[i + 2]);

      diff += (rDiff + gDiff + bDiff) / (255 * 3);
    }

    const totalPixels = data1Pixels.length / 4;
    return diff / totalPixels; // Return a number between 0 and 1
  } catch (error) {
    console.error('Error comparing images:', error);
    throw error;
  }
};
