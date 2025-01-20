import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useCallback, useContext, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, Typography, LinearProgress } from '@mui/material';
import ImageType from '../enums/ImageType';
import ImageModel from '../models/ImageModel';
import useDownload from '../hooks/useDownload';
import { useSettings } from './SettingsProvider';
import { Column } from '../components/common/Flex';
import { determineQuality } from '../utils/image.utils';

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

const useImages = () => useContext(ImageContext);

const ImageProvider: FC<PropsWithChildren> = ({ children }) => {
  const { settings } = useSettings();
  const { download, zip } = useDownload();

  const [images, setImages] = useState<ImageModel[]>([]);
  const [progressDialog, setProgressDialog] = useState({ open: false, message: 'Processing...', progress: 0 });

  const updateProgress = useCallback((index: number) => {
    const progress = Math.round(((index + 1) / images.length) * 100);
    setProgressDialog({
      open: true,
      message: `Converting ${images[index].name} (${index + 1}/${images.length})`,
      progress,
    });
  }, [images]);

  const saveImages = useCallback(async (type: ImageType) => {
    const files: { name: string; url: string; }[] = [];

    for (let i = 0; i < images.length; i++) {
      updateProgress(i);

      const quality = determineQuality(type, settings.quality);
      const image = quality < 0 || quality > 1
        ? await images[i].convertAutoQuality(type)
        : await images[i].convert(type, quality);

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

export { useImages };
export default ImageProvider;
