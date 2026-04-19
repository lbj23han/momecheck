import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'mome-check',
  brand: {
    displayName: '몸매체크',
    primaryColor: '#FF6B6B',
    icon: 'https://momecheck.vercel.app/icon-512.png',
  },
  web: {
    host: 'localhost',
    port: 3000,
    commands: {
      dev: 'next dev',
      build: 'TOSS_BUILD=true next build',
    },
  },
  permissions: [],
  outdir: 'dist/web',
});
