const isTossBuild = process.env.TOSS_BUILD === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(isTossBuild && {
    output: 'export',
    distDir: 'dist/web',
  }),
  images: {
    unoptimized: isTossBuild,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: [
              'https://mome-check.apps.tossmini.com',
              'https://mome-check.private-apps.tossmini.com',
            ].join(', '),
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
