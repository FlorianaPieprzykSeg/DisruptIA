import PropTypes from 'prop-types';
import { createContext, useEffect, useContext, useMemo, useCallback, useState } from 'react';
// hooks
import useLocalStorage from '../../hooks/useLocalStorage';
// utils
import localStorageAvailable from '../../utils/localStorageAvailable';
//
import { defaultSettings } from './config-setting';
import { defaultPreset, getPresets, presetsOption } from './presets';
import { setSettingsFromPanel } from '../../utils/userTools';

// ----------------------------------------------------------------------

const initialState = {
  ...defaultSettings,
  // Mode
  onToggleMode: () => {},
  onChangeMode: () => {},
  // Direction
  onToggleDirection: () => {},
  onChangeDirection: () => {},
  onChangeDirectionByLang: () => {},
  // Layout
  onToggleLayout: () => {},
  onChangeLayout: () => {},
  // Contrast
  onToggleContrast: () => {},
  onChangeContrast: () => {},
  // Color
  onChangeColorPresets: () => {},
  presetsColor: defaultPreset,
  presetsOption: [],
  // Stretch
  onToggleStretch: () => {},
  // Reset
  onResetSetting: () => {},
  // Set New Settings
  setNewSetting: () => {},
};

// ----------------------------------------------------------------------


export const SettingsContext = createContext(initialState);

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettingsContext must be use inside SettingsProvider');

  //get user and indicators to load the right settings
  const user = JSON.parse(localStorage.getItem('user'));
  let login = localStorage.getItem('login');
  let logout = localStorage.getItem('logout');

  //set the right settings regarding the login/logout
  if(user && login == 'true') {
    context.setNewSetting(defaultSettings);
    login = false;
    localStorage.setItem('login', false);
  } else if(logout == 'true') {
    context.setNewSetting(defaultSettings);
    logout = false;
    localStorage.setItem('logout', false);
  }

  return context;
};

// ----------------------------------------------------------------------

SettingsProvider.propTypes = {
  children: PropTypes.node,
};

export function SettingsProvider({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const [settings, setSettings] = (!user || (user && !user.prefs))?useLocalStorage('settings', defaultSettings):useLocalStorage('settings', user.prefs)

  const storageAvailable = localStorageAvailable();

  const langStorage = storageAvailable ? localStorage.getItem('i18nextLng') : '';

  const isArabic = langStorage === 'ar';

  useEffect(() => {
    if (isArabic) {
      onChangeDirectionByLang('ar');
    }
  }, [isArabic]);


  // Mode
  const onToggleMode = useCallback(() => {
    const themeMode = (settings.themeMode === 'light') ? 'dark' : 'light';    
    const newSettings = {...settings, themeMode};
    setSettings(newSettings);
    setSettingsFromPanel(user, newSettings);
  }, [setSettings, settings]);

  const onChangeMode = useCallback(
    (event) => {
      const themeMode = event.target.value;
      const newSettings = {...settings, themeMode};
      setSettings(newSettings);
      setSettingsFromPanel(user, newSettings);
    },
    [setSettings, settings]
  );

  // Direction
  const onToggleDirection = useCallback(() => {
    const themeDirection = settings.themeDirection === 'rtl' ? 'ltr' : 'rtl';
    const newSettings = {...settings, themeDirection};
    setSettings(newSettings);
    setSettingsFromPanel(user, newSettings);
  }, [setSettings, settings]);

  const onChangeDirection = useCallback(
    (event) => {
      const themeDirection = event.target.value;
      const newSettings = {...settings, themeDirection};
      setSettings(newSettings);
      setSettingsFromPanel(user, newSettings);
    },
    [setSettings, settings]
  );

  const onChangeDirectionByLang = useCallback(
    (lang) => {
      const themeDirection = lang === 'ar' ? 'rtl' : 'ltr';
      const newSettings = {...settings, themeDirection};
      setSettings(newSettings);
      setSettingsFromPanel(user, newSettings);

    },
    [setSettings, settings]
  );

  // Layout
  const onToggleLayout = useCallback(() => {
    const themeLayout = settings.themeLayout === 'vertical' ? 'mini' : 'vertical';
    const newSettings = {...settings, themeLayout};
    setSettings(newSettings);
    setSettingsFromPanel(user, newSettings);
  }, [setSettings, settings]);

  const onChangeLayout = useCallback(
    (event) => {
      const themeLayout = event.target.value;
      const newSettings = {...settings, themeLayout};
      setSettings(newSettings);
      setSettingsFromPanel(user, newSettings);
    },
    [setSettings, settings]
  );

  // Contrast
  const onToggleContrast = useCallback(() => {
    const themeContrast = settings.themeContrast === 'default' ? 'bold' : 'default';
    const newSettings = {...settings, themeContrast};
    setSettings(newSettings);
    setSettingsFromPanel(user, newSettings);
  }, [setSettings, settings]);

  const onChangeContrast = useCallback(
    (event) => {
      const themeContrast = event.target.value;
      const newSettings = {...settings, themeContrast};
      setSettings(newSettings);
      setSettingsFromPanel(user, newSettings);
    },
    [setSettings, settings]
  );

  // Color
  const onChangeColorPresets = useCallback(
    (event) => {
      const themeColorPresets = event.target.value;
      const newSettings = {...settings, themeColorPresets};
      setSettings(newSettings);
      setSettingsFromPanel(user, newSettings);
    },
    [setSettings, settings]
  );

  // Stretch
  const onToggleStretch = useCallback(() => {
    const themeStretch = !settings.themeStretch;
    const newSettings = {...settings, themeStretch};
    setSettings(newSettings);
    setSettingsFromPanel(user, newSettings);
  }, [setSettings, settings]);

  // Reset
  const onResetSetting = useCallback(() => {
    setSettings(defaultSettings);
  }, [setSettings]);

  // Set New Settings
  const setNewSetting = useCallback((newThing) => {
    setSettings(newThing);
  }, []);
  
  const memoizedValue = useMemo(
    () => ({
      ...settings,
      // Mode
      onToggleMode,
      onChangeMode,
      // Direction
      onToggleDirection,
      onChangeDirection,
      onChangeDirectionByLang,
      // Layout
      onToggleLayout,
      onChangeLayout,
      // Contrast
      onChangeContrast,
      onToggleContrast,
      // Stretch
      onToggleStretch,
      // Color
      onChangeColorPresets,
      presetsOption,
      presetsColor: getPresets(settings?.themeColorPresets),
      // Reset
      onResetSetting,
      // Set New Settings
      setNewSetting,
    }),
    [
      settings,
      // Mode
      onToggleMode,
      onChangeMode,
      // Direction
      onToggleDirection,
      onChangeDirection,
      onChangeDirectionByLang,
      // Layout
      onToggleLayout,
      onChangeLayout,
      onChangeContrast,
      // Contrast
      onToggleContrast,
      // Stretch
      onToggleStretch,
      // Color
      onChangeColorPresets,
      // Reset
      onResetSetting,
      // Set New Settings
      setNewSetting,
    ]
  );

  return <SettingsContext.Provider value={memoizedValue}>{children}</SettingsContext.Provider>;
}
