import { Grid2 as Grid } from '@mui/material';
import { useImages } from '../providers/ImageProvider';
import ImageCard from './ImageCard';

const ImageGrid = () => {
  const { images } = useImages();

  return (
    <Grid container spacing={2} sx={{ p: 3 }}>
      {images.map((image, i) => (
        <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={i}>
          <ImageCard {...image} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ImageGrid;
