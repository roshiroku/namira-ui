import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useCallback, useContext, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, Typography, LinearProgress } from '@mui/material';
import ImageType from '../enums/ImageType';
import ImageModel from '../models/ImageModel';
import useDownload from '../hooks/useDownload';
import { useSettings } from './SettingsProvider';
import { Column } from '../components/common/Flex';

interface ImageContextProps {
  images: ImageModel[];
  setImages: Dispatch<SetStateAction<ImageModel[]>>;
  saveImages: (format: ImageType) => void;
}

const ImageContext = createContext<ImageContextProps>({
  images: [],
  setImages: () => { },
  saveImages: () => { },
});

export const useImages = () => useContext(ImageContext);

const ImageProvider: FC<PropsWithChildren> = ({ children }) => {
  const { settings } = useSettings();
  const { download, zip } = useDownload();

  const [images, setImages] = useState<ImageModel[]>([]);
  const [progressDialog, setProgressDialog] = useState({ open: false, message: 'Processing...', progress: 0 });

  const updateProgress = useCallback((index: number, message?: string) => {
    const progress = Math.round(((index + 1) / images.length) * 100);
    setProgressDialog({
      open: true,
      message: message || `Converting ${images[index].name} (${index + 1}/${images.length})`,
      progress,
    });
  }, [images]);

  const saveImages = useCallback(async (type: ImageType) => {
    const files: { name: string; url: string; }[] = [];

    for (let i = 0; i < images.length; i++) {
      updateProgress(i);

      const customQuality = [ImageType.JPG, ImageType.JPEG, ImageType.WEBP].includes(type);
      let image: ImageModel;
      let quality = customQuality ? settings.quality : 1;
      let fileSize = customQuality ? settings.maxFileSize : -1;

      if (quality < 0 || quality > 1) {
        const res = await images[i].convertAutoQuality(type);
        quality = res.quality;
        image = res.image;
      } else {
        image = await images[i].convert(type, quality);
      }

      if (fileSize !== -1 && image.size > fileSize) {
        updateProgress(i, `Compressing ${images[i].name} to meet file size limits...`);
        const res = await image.compress(fileSize, type, quality);
        quality = res.quality;
        image = res.image;
        updateProgress(i, `Compressed ${images[i].name} successfully.`);
      }

      files.push({ name: image.filename, url: image.src });
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

export default ImageProvider;
