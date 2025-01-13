import { FC } from 'react';
import { Box, CssBaseline } from '@mui/material';
import ThemeProvider from './providers/ThemeProvider';
import ImageProvider from './providers/ImageProvider';
import { Column } from './components/common/Flex';
import Header from './components/Header';
import Main from './components/Main';

const App: FC = () => {
  return (
    <ThemeProvider>
      <ImageProvider>
        <CssBaseline />
        <Column sx={{ minHeight: '100vh' }}>
          <Header />
          <Box sx={{ flexGrow: 1 }}>
            <Main />
          </Box>
        </Column>
      </ImageProvider>
    </ThemeProvider>
  );
};

export default App;
