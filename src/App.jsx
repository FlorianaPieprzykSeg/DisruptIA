// i18n
import './locales/i18n';
// router
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import Router from './routes';
import { AuthProvider } from './auth/JwtContext';
// redux
import { store } from './redux/store';
import { Provider as ReduxProvider } from 'react-redux';

import SnackbarProvider from './components/snackbar';
import { MotionLazyContainer } from './components/animate';
import ScrollToTop from './components/scroll-to-top';
// theme
import ThemeProvider from './theme';
//setting 
import { ThemeSettings, SettingsProvider } from './components/settings';
// error boundary
import { ErrorBoundary } from 'react-error-boundary'
// ErrorFallback
import Page404 from './pages/Page404';
//@mui
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
function App() {

  return (

    <AuthProvider>
      <ReduxProvider store={store}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
          <SettingsProvider>
            <BrowserRouter>
              <ScrollToTop />
              <MotionLazyContainer>
                <ThemeProvider>
                  <ThemeSettings>
                    <SnackbarProvider>
                      <ErrorBoundary FallbackComponent={Page404}>
                        <Router></Router>
                      </ErrorBoundary>
                    </SnackbarProvider>
                  </ThemeSettings>
                </ThemeProvider>
              </MotionLazyContainer>
            </BrowserRouter>
          </SettingsProvider>
        </LocalizationProvider>
      </ReduxProvider>
    </AuthProvider>


  );
}

export default App