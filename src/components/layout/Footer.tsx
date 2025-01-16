import { FC } from 'react';
import { Box, Divider, Typography, Link } from '@mui/material';
import { Column } from '../common/Flex';

const Footer: FC = () => {
  return (
    <Column component="footer">
      <Divider />
      <Box sx={{ px: { xs: 2, sm: 3 }, py: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.primary" fontWeight={400}>
          Built with ❤️ by <Link href="https://github.com/roshiroku" target="_blank" rel="noopener" color="text.primary">Shir Raanan</Link>
        </Typography>
      </Box>
    </Column>
  );
};

export default Footer;
