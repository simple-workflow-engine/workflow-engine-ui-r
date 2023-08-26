import type { PaletteMode } from '@mui/material';
import { CssBaseline, ThemeProvider } from '@mui/material';
import type { FC, ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import Cookies from 'js-cookie';
import { APP_THEME } from '@/lib/constants/cookie';
import { SnackbarProvider } from 'notistack';
import { getTheme } from '@/lib/theme/theme';

const ThemeContext = createContext<{
  mode: PaletteMode;
  changeMode: (mode: PaletteMode) => void;
}>({
  mode: 'light',
  changeMode: () => null,
});

const ThemePaletteSchema = z.enum(['light', 'dark']);

export const useThemeContext = () => useContext(ThemeContext);

interface Props {
  children: ReactNode;
}

const ThemeContextProvider: FC<Props> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>('light');

  useEffect(() => {
    const appTheme = Cookies.get(APP_THEME);

    const parsedAppTheme = ThemePaletteSchema.safeParse(appTheme);

    if (parsedAppTheme.success) {
      setMode(() => parsedAppTheme.data);
    } else {
      Cookies.set(APP_THEME, mode);
    }
  }, []);

  const changeMode = (newMode: PaletteMode) => {
    setMode(() => newMode);
    Cookies.set(APP_THEME, newMode);
  };

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeContext.Provider
      value={{
        mode,
        changeMode,
      }}
    >
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          anchorOrigin={{
            horizontal: 'right',
            vertical: 'top',
          }}
        >
          <CssBaseline />
          {children}
        </SnackbarProvider>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
