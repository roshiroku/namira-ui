import { FC, useMemo } from 'react';
import { Box, CardMedia, Typography } from '@mui/material';

const MAX_NAME_LENGTH = 64;

const ImageCard: FC<ImageFile> = ({ name, src }) => {
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
        draggable={false}
      />
      <Typography
        variant="h6"
        noWrap
        sx={{ p: 1, textAlign: 'center', fontWeight: 400, whiteSpace: 'wrap' }}
      >
        {truncateName}
      </Typography>
    </Box>
  );
};

export default ImageCard;
