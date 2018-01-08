export default [
  // - Dashboard
  {
    name: 'dashboard',
    path: '',
    meta: { auth: true },
    component: resolve => require.ensure([], () => resolve(require('../../views/pages/Dashboard')), 'dashboard')
  },
  // - Containers
  {
    name: 'containers',
    path: '/containers',
    meta: { auth: 'ct_infos' },
    component: resolve => require.ensure([], () => resolve(require('../../views/pages/Containers')), 'containers')
  }
];
