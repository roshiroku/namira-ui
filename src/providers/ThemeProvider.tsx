import { FC, PropsWithChildren, useMemo } from 'react';
import { createTheme, darken, emphasize, ThemeProvider as MuiThemeProvider } from '@mui/material';
import '@fontsource-variable/inter/index.css';
import { useSettings } from './SettingsProvider';
import { blue } from '@mui/material/colors';

const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const { settings } = useSettings();

  const theme = useMemo(() => {
    let mode: 'light' | 'dark' = 'light';

    if (settings.theme === 'system') {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      mode = prefersDarkMode ? 'dark' : 'light';
    } else {
      mode = settings.theme;
    }

    return createTheme({
      palette: {
        mode,
        primary: {
          main: mode === 'dark' ? blue[300] : blue[600],
          light: blue[200],
          lighter: blue[100],
          lightest: blue[50],
          dark: blue[700],
          darker: blue[800],
          darkest: darken(emphasize(blue[900], 0.5), 0.875),
          ...blue
        } as any
      },
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
  }, [settings.theme]);

  return (
    <MuiThemeProvider theme={theme}>
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
