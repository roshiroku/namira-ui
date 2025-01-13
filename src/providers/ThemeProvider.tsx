import { FC, PropsWithChildren } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';

const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const theme = createTheme({
    palette: { mode: 'light' },
    components: {
      MuiAppBar: {
        defaultProps: {
          elevation: 0
        }
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true
        }
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
