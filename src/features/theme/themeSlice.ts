import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
  systemPrefersDark: boolean;
}

const initialState: ThemeState = {
  mode: 'system',
  isDark: false,
  systemPrefersDark: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      // Update isDark based on mode
      if (action.payload === 'system') {
        state.isDark = state.systemPrefersDark;
      } else {
        state.isDark = action.payload === 'dark';
      }
    },
    setSystemPrefersDark: (state, action: PayloadAction<boolean>) => {
      state.systemPrefersDark = action.payload;
      // Only update isDark if mode is set to system
      if (state.mode === 'system') {
        state.isDark = action.payload;
      }
    },
    toggleTheme: (state) => {
      if (state.mode === 'system') {
        state.mode = state.systemPrefersDark ? 'light' : 'dark';
        state.isDark = !state.systemPrefersDark;
      } else if (state.mode === 'light') {
        state.mode = 'dark';
        state.isDark = true;
      } else {
        state.mode = 'light';
        state.isDark = false;
      }
    },
  },
});

export const { setThemeMode, setSystemPrefersDark, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
