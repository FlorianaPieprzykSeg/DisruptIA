// routes
import { PATH_AUTH } from '../routes/paths';
// utils
import axios from '../utils/axios';

export const isValidToken = (accessToken) => {
    if (!accessToken) {
        return false;
    }

    // const decoded = jwtDecode(accessToken);

    // const currentTime = Date.now() / 1000;

    return true;
};

// ----------------------------------------------------------------------

export const tokenExpired = () => {
    let expiredTimer;

    const currentTime = Date.now();

    // Test token expires after 7hs
    const timeLeft = currentTime + 25200000 - currentTime; // ~7h

    clearTimeout(expiredTimer);

    expiredTimer = setTimeout(() => {
        localStorage.removeItem('accessToken');
        window.location.href = PATH_AUTH.login;
    }, timeLeft);
};


export const setSession = (accessToken) => {
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken);

        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        // This function below will handle when token is expired
        tokenExpired();
    } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        localStorage.removeItem('settings');
        delete axios.defaults.headers.common.Authorization;
    }
}