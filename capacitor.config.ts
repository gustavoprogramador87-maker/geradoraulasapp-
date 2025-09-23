import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gerador.aulas',
  appName: 'Gerador de Aulas',
  webDir: '.',
  server: {
    androidScheme: 'https'
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#2c5aa0",
      showSpinner: false
    },
    Filesystem: {
      ioTimeout: 30000
    }
  }
};

export default config;
