import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTheme } from '@mui/material';
import ImageModel from '../models/ImageModel';
import useDropZone from '../hooks/useDropZone';
import { useImages } from '../providers/ImageProvider';
import DropZone from './DropZone';

const ImageUpload = () => {
  const theme = useTheme();
  const [files, setFiles] = useState<File[]>([]);
  const { images, setImages } = useImages();
  const { isDragging } = useDropZone({ element: window, accept: 'image/*' });
  const showDropZone = useMemo(() => !images.length || isDragging, [images, isDragging]);
  const readImages = useCallback(() => Promise.all(files.map(ImageModel.create)), [files]);

  useEffect(() => {
    if (files.length) {
      readImages().then((images) => {
        setImages((prev) => [...prev, ...images]);
        setFiles([]);
      });
    }
  }, [files]);

  return (
    <DropZone
      accept="image/*"
      onDrop={(ev) => setFiles(Array.from(ev.dataTransfer.files || []))}
      onChange={images.length ? undefined : (ev) => setFiles(Array.from(ev.target.files || []))}
      sx={{
        position: 'fixed',
        inset: 0,
        visibility: showDropZone ? '' : 'hidden',
        zIndex: theme.zIndex.appBar + 1
      }}
    />
  );
};

export default ImageUpload;
