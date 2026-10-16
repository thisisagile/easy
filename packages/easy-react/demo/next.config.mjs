const basePath = '/demo';

export default {
  basePath,
  poweredByHeader: false,
  reactStrictMode: true,
  redirects: () => [{ source: '/', destination: `http://localhost:3001${basePath}`, permanent: false, basePath: false }],
};
