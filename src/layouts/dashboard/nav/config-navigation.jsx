// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  dashboard: icon('ic_dashboard'),
  newElement1: icon('ic_file'),
  newElement2: icon('ic_file'),
  user: icon('ic_user'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      { title: 'dashboard', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
      // New Element
      {
        title: 'new Element 1',
        path: PATH_DASHBOARD.newElement1.list,
        icon: ICONS.newElement1,
      }
    ],
  },
  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      // New Element
      {
        title: 'new Element 2',
        path: PATH_DASHBOARD.newElement2.list,
        icon: ICONS.newElement2,
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
