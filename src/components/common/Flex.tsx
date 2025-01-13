import { forwardRef } from 'react';
import { Box, BoxProps } from '@mui/material';

const Row = forwardRef<typeof Box, BoxProps>((props, ref) => {
  return <Box ref={ref} {...props} sx={{ display: 'flex', flexDirection: 'row', ...props.sx }} />;
});

const Column = forwardRef<typeof Box, BoxProps>((props, ref) => {
  return <Box ref={ref} {...props} sx={{ display: 'flex', flexDirection: 'column', ...props.sx }} />;
});

export { Row, Column };
