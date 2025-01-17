import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useCallback, useContext, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, Typography, LinearProgress } from '@mui/material';
import { ImageFormat } from '../enums/ImageFormat';
import useDownload from '../hooks/useDownload';
import { useSettings } from './SettingsProvider';
import { compareImages, getImageData } from '../utils/image.utils';
import { convertImage } from '../utils/convert.utils';
import { Column } from '../components/common/Flex';

interface QualityConfig {
  maxDifference?: number;
  step?: number;
  initialQuality?: number;
}

interface ImageContextProps {
  images: ImageFile[];
  setImages: Dispatch<SetStateAction<ImageFile[]>>;
  saveImages: (format: ImageFormat) => void;
}

const ImageContext = createContext<ImageContextProps>({
  images: [],
  setImages: () => { },
  saveImages: () => { },
});

const useImages = () => useContext(ImageContext);

const ImageProvider: FC<PropsWithChildren> = ({ children }) => {
  const { settings } = useSettings();
  const { download, zip } = useDownload();

  const [images, setImages] = useState<ImageFile[]>([]);
  const [progressDialog, setProgressDialog] = useState({ open: false, message: 'Processing...', progress: 0 });

  const detectQuality = useCallback(async (
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
        break;
      }
    }

    return minQuality;
  }, []);

  const saveImages = useCallback(async (format: ImageFormat) => {
    const files: { name: string; url: string; }[] = [];

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const progress = Math.round(((i + 1) / images.length) * 100);
      let { quality } = settings;

      if (['image/jpg', 'image/jpeg', 'image/webp'].includes(format)) {
        if (quality < 0 || quality > 1) {
          setProgressDialog({ open: true, message: `Detecting quality for ${image.name} (${i + 1}/${images.length})`, progress });
          quality = await detectQuality(image, format);
        }
      } else {
        quality = 1;
      }

      setProgressDialog({ open: true, message: `Converting ${image.name} (${i + 1}/${images.length})`, progress });
      const { name, src: url } = await convertImage(image, { format, quality });
      files.push({ name, url });
    }

    setProgressDialog({ open: false, message: 'Processing complete', progress: 100 });

    if (settings.zipDownload) {
      await zip(files, 'images');
    } else {
      download(files);
    }
  }, [images, settings]);

  const ctx = useMemo(() => ({ images, setImages, saveImages }), [images, saveImages]);

  return (
    <ImageContext.Provider value={ctx}>
      {children}

      <Dialog open={progressDialog.open} maxWidth="sm" fullWidth>
        <DialogTitle>Processing Images</DialogTitle>
        <DialogContent>
          <Column gap={2}>
            <Typography>{progressDialog.message}</Typography>
            <LinearProgress variant="determinate" value={progressDialog.progress} sx={{ width: '100%' }} />
          </Column>
        </DialogContent>
      </Dialog>
    </ImageContext.Provider>
  );
};

export { useImages };
export default ImageProvider;
