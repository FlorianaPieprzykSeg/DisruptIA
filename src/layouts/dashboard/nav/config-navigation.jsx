// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  aor: icon('ic_file'),
  database: icon('ic_file'),
  user: icon('ic_user'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      // New Element
      {
        title: 'appels d\'offres',
        path: PATH_DASHBOARD.aor.list,
        icon: ICONS.aor,
      },
      {
        title: 'Base de données',
        path: PATH_DASHBOARD.database.list,
        icon: ICONS.database,
      }
    ],
  },
  // Settings
  // ----------------------------------------------------------------------
  {
    subheader: 'settings',
    items: [
      {
        title: 'users',
        path: PATH_DASHBOARD.user.list,
        icon: ICONS.user,
      },
    ],
  },
];

export default navConfig;
