import { Box, CardMedia, Typography } from '@mui/material';
import { useMemo } from 'react';

const MAX_NAME_LENGTH = 64;

const ImageCard: React.FC<ImageFile> = ({ name, src }) => {
  const truncateName = useMemo(() => (
    name.length > MAX_NAME_LENGTH ? `${name.substring(0, MAX_NAME_LENGTH - 3)}...` : name
  ), [name]);

  return (
    <Box>
      <CardMedia
        component="img"
        src={src}
        alt={name}
        sx={{ aspectRatio: 1, objectFit: 'contain', objectPosition: 'bottom' }}
      />
      <Typography
        variant="h6"
        component="div"
        noWrap
        sx={{ p: 1, textAlign: 'center', whiteSpace: 'wrap' }}
      >
        {truncateName}
      </Typography>
    </Box>
  );
};

export default ImageCard;
