import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.donateconnect.app',
  appName: 'DonateConnect',
  webDir: 'dist',
  server: {
    cleartext: true
  }
};

export default config;
