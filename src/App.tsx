import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, createTheme, CssBaseline, Grid2, ThemeProvider } from '@mui/material';
import { Column } from './components/common/Flex';
import DropZone from './components/DropZone';
import useDropZone from './hooks/useDropZone';
import ImageCard from './components/ImageCard';
import Header from './components/Header';

const App: React.FC = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const theme = createTheme({ palette: { mode: 'light' } });

  const { isDragging } = useDropZone({ element: window });

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Column sx={{ minHeight: '100vh' }}>
        <Header />
        <Box sx={{ flexGrow: 1 }}>
          <Grid2 container spacing={2} sx={{ p: 3 }}>
            {images.map((image, i) => (
              <Grid2 size={{ xs: 6, sm: 4, lg: 3 }} key={i}>
                <ImageCard {...image} />
              </Grid2>
            ))}
          </Grid2>
          <DropZone
            onDrop={(ev) => setFiles(Array.from(ev.dataTransfer.files || []))}
            onChange={images.length ? undefined : (ev) => setFiles(Array.from(ev.target.files || []))}
            sx={{
              position: 'fixed',
              inset: 0,
              visibility: showDropZone ? '' : 'hidden',
              zIndex: 1100
            }}
          />
        </Box>
      </Column>
    </ThemeProvider>
  );
};

export default App;
