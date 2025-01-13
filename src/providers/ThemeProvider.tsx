import { FC, PropsWithChildren } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';
import '@fontsource-variable/inter/index.css';

const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const theme = createTheme({
    palette: { mode: 'light' },
    typography: {
      fontFamily: "'Inter Variable', sans-serif",
      h6: { lineHeight: 1.5 }
    },
    components: {
      MuiAppBar: {
        defaultProps: { elevation: 0 }
      },
      MuiButton: {
        defaultProps: { disableElevation: true }
      }
    }
  });

  return (
    <MuiThemeProvider theme={theme}>
      {children}
    </MuiThemeProvider>
  )
};

export default ThemeProvider;
