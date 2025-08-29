
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: 'https://github.com/chrissplendid/smart-attendance-system',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/chrissplendid/smart-attendance-system"
  },
  {
    "renderMode": 2,
    "route": "/chrissplendid/smart-attendance-system/register"
  },
  {
    "renderMode": 2,
    "route": "/chrissplendid/smart-attendance-system/reset-password"
  },
  {
    "renderMode": 2,
    "route": "/chrissplendid/smart-attendance-system/admin-dashboard"
  },
  {
    "renderMode": 2,
    "route": "/chrissplendid/smart-attendance-system/admin-dashboard/dashboard"
  },
  {
    "renderMode": 2,
    "route": "/chrissplendid/smart-attendance-system/admin-dashboard/attendance-logs"
  },
  {
    "renderMode": 2,
    "route": "/chrissplendid/smart-attendance-system/admin-dashboard/enroll-biometric"
  },
  {
    "renderMode": 2,
    "route": "/chrissplendid/smart-attendance-system/admin-dashboard/settings"
  },
  {
    "renderMode": 2,
    "route": "/chrissplendid/smart-attendance-system/admin-dashboard/user-management"
  },
  {
    "renderMode": 2,
    "route": "/chrissplendid/smart-attendance-system/staff-dashboard"
  },
  {
    "renderMode": 2,
    "route": "/chrissplendid/smart-attendance-system/staff-dashboard/analytics"
  },
  {
    "renderMode": 2,
    "route": "/chrissplendid/smart-attendance-system/staff-dashboard/attendance-logs"
  },
  {
    "renderMode": 2,
    "route": "/chrissplendid/smart-attendance-system/staff-dashboard/profile"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 31947, hash: '4bf94004eb0c2332a61398de953e4f8194a4c736cdf3d009304d0435f9786cd3', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 21109, hash: '7b513b45183ccb11dda3950c671ef2c2ed9dd63588dc1093bf5d6e4b238c884a', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'admin-dashboard/index.html': {size: 66974, hash: '4b7c5d2ee6468067c03ded6c5eeb78d495f434c8881bee6cfcd13ccf4ba549c0', text: () => import('./assets-chunks/admin-dashboard_index_html.mjs').then(m => m.default)},
    'index.html': {size: 48070, hash: 'b8df1249f9ef995761589d51c9b671cb71fe3b8e614f32b04b4f32ced96442fa', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'reset-password/index.html': {size: 93033, hash: 'e48a2e02ef1b7abec663a7438966cf1502876dd3e1e1e2a12abe94899b2b2025', text: () => import('./assets-chunks/reset-password_index_html.mjs').then(m => m.default)},
    'register/index.html': {size: 110571, hash: '4678964014c1023ed5558c9feeffa41ae047c7b0e7ea48a84cd1ee28ce824fe4', text: () => import('./assets-chunks/register_index_html.mjs').then(m => m.default)},
    'admin-dashboard/dashboard/index.html': {size: 66974, hash: '4b7c5d2ee6468067c03ded6c5eeb78d495f434c8881bee6cfcd13ccf4ba549c0', text: () => import('./assets-chunks/admin-dashboard_dashboard_index_html.mjs').then(m => m.default)},
    'admin-dashboard/attendance-logs/index.html': {size: 60188, hash: '3dfddfc4cc5729867181684354cf855d66ccbe02fe6a2cf531c4e64feb3572b9', text: () => import('./assets-chunks/admin-dashboard_attendance-logs_index_html.mjs').then(m => m.default)},
    'admin-dashboard/settings/index.html': {size: 59364, hash: 'a1d13547264f4207c6499bc4695b976f7f7c411f0c6ee8490aa5d1a8f3b05a55', text: () => import('./assets-chunks/admin-dashboard_settings_index_html.mjs').then(m => m.default)},
    'admin-dashboard/enroll-biometric/index.html': {size: 67225, hash: 'fba19c0121521fa30786a9c7ac33392f5ec125a4e5ea94c07ab03a9a749da4fe', text: () => import('./assets-chunks/admin-dashboard_enroll-biometric_index_html.mjs').then(m => m.default)},
    'admin-dashboard/user-management/index.html': {size: 61993, hash: 'dc6853326782e39b53138277afa9e9e99677e648779a6aa0602e9674d999dff1', text: () => import('./assets-chunks/admin-dashboard_user-management_index_html.mjs').then(m => m.default)},
    'staff-dashboard/index.html': {size: 64412, hash: 'd09e7bb06bacfe3248b53ec97b32297a2b3658edda48bc99c9f91a37070e867f', text: () => import('./assets-chunks/staff-dashboard_index_html.mjs').then(m => m.default)},
    'staff-dashboard/profile/index.html': {size: 58484, hash: 'df2ccb29eb5436c57a1b5d0b2319b0057e2d4174933139a6e3cdff76e57789f9', text: () => import('./assets-chunks/staff-dashboard_profile_index_html.mjs').then(m => m.default)},
    'staff-dashboard/analytics/index.html': {size: 64412, hash: 'd09e7bb06bacfe3248b53ec97b32297a2b3658edda48bc99c9f91a37070e867f', text: () => import('./assets-chunks/staff-dashboard_analytics_index_html.mjs').then(m => m.default)},
    'staff-dashboard/attendance-logs/index.html': {size: 58339, hash: '70aa3654b4097954b452cc9dc44ac70d1a3bdea32761f4b198e6c66962875380', text: () => import('./assets-chunks/staff-dashboard_attendance-logs_index_html.mjs').then(m => m.default)},
    'styles-KFL7ZUHR.css': {size: 237750, hash: 'd4MoV6x0xiE', text: () => import('./assets-chunks/styles-KFL7ZUHR_css.mjs').then(m => m.default)}
  },
};
