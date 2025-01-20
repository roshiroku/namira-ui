import ImageType from '../enums/ImageType';

export const compareImages = async (data1: ImageData, data2: ImageData): Promise<number> => {
  if (!data1 || !data2) {
    throw new Error('Both data inputs are required for comparison.');
  }

  try {
    const data1Pixels = data1.data;
    const data2Pixels = data2.data;

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

export const inferImageType = (src: string): string => {
  const extension = src.split('.').pop()?.toLowerCase();

  if (extension) {
    if (extension === 'jpg') {
      return 'image/jpeg';
    }
    return `image/${extension}`;
  } else if (src.startsWith('data:')) {
    return src.substring(5, src.indexOf(';')) || 'unknown';
  } else {
    return 'unknown';
  }
};

export const determineQuality = (type: ImageType, quality: number): number => {
  if (![ImageType.JPG, ImageType.JPEG, ImageType.WEBP].includes(type)) {
    return 1; // Enforce quality 1 for unsupported types
  }
  return quality;
};
