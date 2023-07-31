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
    newElement1: {
      root: path(ROOTS_DASHBOARD, '/newElement1'),
      new: path(ROOTS_DASHBOARD, '/newElement1/new'),
      list: path(ROOTS_DASHBOARD, '/newElement1/list'),
      edit: (name) => path(ROOTS_DASHBOARD, `/newElement1/${name}/edit`),
    },
    newElement2: {
      root: path(ROOTS_DASHBOARD, '/newElement2'),
      new: path(ROOTS_DASHBOARD, '/newElement2/new'),
      list: path(ROOTS_DASHBOARD, '/newElement2/list'),
      edit: (name) => path(ROOTS_DASHBOARD, `/newElement2/${name}/edit`),
    },
 }

 export const PATH_PAGE = {
  page404: '/404',
};