import { ImageModel } from 'namira';
import { useCallback, useMemo } from 'react';
import { Button, Fade, Grid2 as Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { TransitionGroup } from 'react-transition-group';
import useMap from '../hooks/useMap';
import { useImages } from '../providers/ImageProvider';
import ImageCard from './ImageCard';

const ImageGrid = () => {
  const { images, setImages } = useImages();
  const { map: imageMap } = useMap(images);

  const imageEntries = useMemo(() => Array.from(imageMap.entries()), [imageMap]);

  const handleRemove = useCallback((image: ImageModel) => {
    setImages((prev) => prev.filter((other) => other !== image));
  }, []);

  return (
    <TransitionGroup component={Grid} container spacing={2} sx={{ p: { xs: 2, sm: 3 } }}>
      {imageEntries.map(([key, image]) => (
        <Fade key={key}>
          <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} sx={{ position: 'relative' }}>
            <Button
              variant="contained"
              size="small"
              color="error"
              sx={{ position: 'absolute', top: 0, right: 0, minWidth: 0, p: 0 }}
              onClick={() => handleRemove(image)}
            >
              <CloseIcon />
            </Button>
            <ImageCard {...image} />
          </Grid>
        </Fade>
      ))}
    </TransitionGroup>
  );
};

export default ImageGrid;
