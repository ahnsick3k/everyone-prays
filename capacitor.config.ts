import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.every1pray',
  appName: 'every1pray',
  webDir: 'cap-shell',
  server: {
    url: 'https://hugging.kr/every1pray',
    cleartext: false,
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#FFF9F5',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
  },
};

export default config;
