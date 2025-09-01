import React, { createContext, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setSystemPrefersDark, setThemeMode } from '../features/theme/themeSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextType {
  isDark: boolean;
  themeMode: 'light' | 'dark' | 'system';
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    text: string;
    textSecondary: string;
    border: string;
    card: string;
    success: string;
    error: string;
    warning: string;
    isDark: boolean;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const { isDark, mode: themeMode } = useAppSelector((state) => state.theme);

  // Load saved theme mode from storage
  useEffect(() => {
    const loadThemeMode = async () => {
      try {
        const savedMode = await AsyncStorage.getItem('theme_mode');
        if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
          dispatch(setThemeMode(savedMode as 'light' | 'dark' | 'system'));
        }
      } catch (error) {
        console.log('Failed to load theme mode:', error);
      }
    };
    loadThemeMode();
  }, [dispatch]);

  // Update system preference
  useEffect(() => {
    dispatch(setSystemPrefersDark(colorScheme === 'dark'));
  }, [colorScheme, dispatch]);

  // Save theme mode to storage
  const handleSetThemeMode = async (mode: 'light' | 'dark' | 'system') => {
    try {
      await AsyncStorage.setItem('theme_mode', mode);
      dispatch(setThemeMode(mode));
    } catch (error) {
      console.log('Failed to save theme mode:', error);
    }
  };

  const toggleTheme = () => {
    if (themeMode === 'system') {
      handleSetThemeMode(colorScheme === 'dark' ? 'light' : 'dark');
    } else if (themeMode === 'light') {
      handleSetThemeMode('dark');
    } else {
      handleSetThemeMode('light');
    }
  };

  const colors = {
    background: isDark ? '#0f172a' : '#f8fafc',
    surface: isDark ? '#1e293b' : '#ffffff',
    primary: isDark ? '#3b82f6' : '#3b82f6',
    secondary: isDark ? '#64748b' : '#64748b',
    text: isDark ? '#f1f5f9' : '#0f172a',
    textSecondary: isDark ? '#94a3b8' : '#475569',
    border: isDark ? '#334155' : '#e2e8f0',
    card: isDark ? '#1e293b' : '#ffffff',
    success: isDark ? '#10b981' : '#10b981',
    error: isDark ? '#ef4444' : '#ef4444',
    warning: isDark ? '#f59e0b' : '#f59e0b',
  };

  const value: ThemeContextType = {
    isDark,
    themeMode,
    setThemeMode: handleSetThemeMode,
    toggleTheme,
    colors,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
