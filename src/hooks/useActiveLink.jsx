import { useLocation, matchPath } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function useActiveLink(path) {
  const { pathname } = useLocation();

  const normalActive = path ? !!matchPath( path.replace('/list','/*'), pathname) : false;

  return {
    active: normalActive,
    isExternalLink: path.includes('http'),
  };
}
