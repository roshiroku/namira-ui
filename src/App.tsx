import { FC } from 'react';
import { Box, CssBaseline } from '@mui/material';
import SettingsProvider from './providers/SettingsProvider';
import ThemeProvider from './providers/ThemeProvider';
import ImageProvider from './providers/ImageProvider';
import { Column } from './components/common/Flex';
import Header from './components/layout/Header';
import ImageGrid from './components/ImageGrid';
import ImageUpload from './components/ImageUpload';

const App: FC = () => {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <ImageProvider>
          <CssBaseline />
          <Column sx={{ minHeight: '100vh' }}>
            <Header />
            <Box sx={{ flexGrow: 1 }}>
              <ImageGrid />
              <ImageUpload />
            </Box>
          </Column>
        </ImageProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
};

export default App;
