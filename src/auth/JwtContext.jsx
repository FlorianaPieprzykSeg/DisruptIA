import PropTypes from 'prop-types';
import { createContext, useReducer, useCallback, useMemo } from 'react';
// utils
import localStorageAvailable from '../utils/localStorageAvailable';
import { setSession } from './utils';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  }

  return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext(null);

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const storageAvailable = localStorageAvailable();

  // LOGIN
  const login = useCallback(async (username, password) => {
    /*const response = await axios.post('/api/login', {
      username,
      password,
    });
    const { accessToken, user } = response.data;*/
    const accessToken = 'token';
    const user = {
      id: 1,
      cat: 'admin',
      fullName: 'Segula Team',
      username: 'Segula_Team',
      password: 'Segula_Team',
      email: 'Segula_Team@Segula.team',
    }
    setSession(accessToken);

    dispatch({
      type: 'LOGIN',
      payload: {
        user,
      },
    });

    //stock the user and a login indicator to charge the user prefs
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("login", true);

  }, []);


  // LOGOUT
  const logout = useCallback(() => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });

    //a logout indicator to charge the default settings
    localStorage.setItem("logout", true);
  }, []);

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: JSON.parse(localStorage.getItem('user')),
      method: 'jwt',
      login,
      logout,
    }),
    [state.isAuthenticated, state.isInitialized, JSON.parse(localStorage.getItem('user')), login, logout]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
