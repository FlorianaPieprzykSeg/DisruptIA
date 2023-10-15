function path(root, sublink) {
    return `${root}${sublink}`;
  }

  const ROOTS_AUTH = '/auth';
  const ROOTS_DASHBOARD = '/dashboard';
  // ----------------------------------------------------------------------

export const PATH_AUTH = {
    root: ROOTS_AUTH,
    login: path(ROOTS_AUTH, '/login'),

    verify: path(ROOTS_AUTH, '/verify'),
 };

 export const PATH_DASHBOARD = {
    root: ROOTS_DASHBOARD,
    general:{
        app: path(ROOTS_DASHBOARD, '/app'),
    },
    user: {
      root: path(ROOTS_DASHBOARD, '/user'),
      new: path(ROOTS_DASHBOARD, '/user/new'),
      list: path(ROOTS_DASHBOARD, '/user/list'),
      account: path(ROOTS_DASHBOARD, '/account'),
      edit: (name) => path(ROOTS_DASHBOARD, `/user/${name}/edit`),
    },
    aor: {
      root: path(ROOTS_DASHBOARD, '/aor'),
      new: path(ROOTS_DASHBOARD, '/aor/new'),
      list: path(ROOTS_DASHBOARD, '/aor/list'),
      edit: (name) => path(ROOTS_DASHBOARD, `/aor/${name}/edit`),
    },
    database: {
      root: path(ROOTS_DASHBOARD, '/database'),
      new: path(ROOTS_DASHBOARD, '/database/new'),
      list: path(ROOTS_DASHBOARD, '/database/list'),
      edit: (name) => path(ROOTS_DASHBOARD, `/database/${name}/edit`),
    },
 }

 export const PATH_PAGE = {
  page404: '/404',
};