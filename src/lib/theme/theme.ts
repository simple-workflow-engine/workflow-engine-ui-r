import type { PaletteMode } from '@mui/material';
import { createTheme } from '@mui/material/styles';

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    typography: {
      allVariants: {
        fontFamily: 'Noto Sans',
      },
    },
    palette: {
      mode,
      primary: {
        main: '#2F3C7E',
      },
      secondary: {
        main: '#FBEAEB',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          contained: {
            textTransform: 'none',
          },
          outlined: {
            textTransform: 'none',
          },
          text: {
            textTransform: 'none',
          },
        },
      },
    },
  });
