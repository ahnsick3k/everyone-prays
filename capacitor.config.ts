import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.everyoneprays',
  appName: 'Every 1 Pray',
  webDir: 'out',
  server: {
    url: 'https://everyone-prays.vercel.app',
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
