const withTM = require('next-transpile-modules')(['@thisisagile/easy'], { resolveSymlinks: true });

const basePath = '/demo';

module.exports = withTM({
  basePath,
  poweredByHeader: false,
  reactStrictMode: true,
  future: { webpack5: false },

  redirects: () => [{ source: '/', destination: `http://localhost:3001${basePath}`, permanent: false, basePath: false }],
});
