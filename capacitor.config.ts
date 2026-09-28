import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.spellingtrainer.english3000',
  appName: 'English 3000 Spelling Trainer',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
