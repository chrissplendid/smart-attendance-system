
export default {
  basePath: 'https://github.com/chrissplendid/smart-attendance-system',
  supportedLocales: {
  "en-US": ""
},
  entryPoints: {
    '': () => import('./main.server.mjs')
  },
};
