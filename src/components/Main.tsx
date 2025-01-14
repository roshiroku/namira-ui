import { useCallback, useEffect, useMemo, useState } from 'react';
import { Grid2 as Grid, useTheme } from '@mui/material';
import useDropZone from '../hooks/useDropZone';
import { useImages } from '../providers/ImageProvider';
import DropZone from './DropZone';
import ImageCard from './ImageCard';

const Main = () => {
  const theme = useTheme();

  const [files, setFiles] = useState<File[]>([]);

  const { images, setImages } = useImages();

  const { isDragging } = useDropZone({ element: window, accept: 'image/*' });

  const showDropZone = useMemo(() => !images.length || isDragging, [images, isDragging]);

  const readImages = useCallback(async () => (
    Promise.all(files.map((file) => (
      new Promise<ImageFile>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve({
          name: file.name,
          type: file.type,
          size: file.size,
          src: `${reader.result}`,
        });
      })
    )))
  ), [files]);

  useEffect(() => {
    if (files.length) {
      readImages().then((images) => {
        setImages((prev) => [...prev, ...images]);
        setFiles([]);
      });
    }
  }, [files]);

  return (
    <>
      <Grid container spacing={2} sx={{ p: 3 }}>
        {images.map((image, i) => (
          <Grid size={{ xs: 6, sm: 4, lg: 3 }} key={i}>
            <ImageCard {...image} />
          </Grid>
        ))}
      </Grid>
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
    </>
  );
};

export default Main;
