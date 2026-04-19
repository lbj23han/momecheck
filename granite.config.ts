import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'mome-check',
  brand: {
    displayName: '몸매체크',
    primaryColor: '#FF6B6B',
    icon: null,
  },
  web: {
    host: 'localhost',
    port: 3000,
    commands: {
      dev: 'next dev',
      build: 'next build',
    },
  },
  permissions: [],
  outdir: 'dist',
});
