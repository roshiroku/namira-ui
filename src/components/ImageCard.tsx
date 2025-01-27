import { ImageModelProps } from 'namira/ImageModel';
import { FC, useMemo } from 'react';
import { Box, CardMedia, Typography } from '@mui/material';

const MAX_NAME_LENGTH = 64;

const ImageCard: FC<ImageModelProps> = ({ filename, src }) => {
  const truncateName = useMemo(() => (
    filename.length > MAX_NAME_LENGTH ? `${filename.substring(0, MAX_NAME_LENGTH - 3)}...` : filename
  ), [filename]);

  return (
    <Box>
      <CardMedia
        component="img"
        src={src}
        alt={filename}
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
