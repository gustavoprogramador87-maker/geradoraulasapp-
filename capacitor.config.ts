import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gerador.aulas',
  appName: 'GeradorAulas',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    allowNavigation: [
      'https://*.openai.com',
      'https://*.googleapis.com',
      'https://api.openai.com'
    ]
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    loggingBehavior: 'debug',
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      releaseType: 'APK'
    }
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#2c5aa0",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#2c5aa0'
    },
    Filesystem: {
      iosDocumentPath: 'DOCUMENTS',
      androidExternalStoragePublicDirectory: 'DOWNLOADS'
    },
    Haptics: {
      enabled: true
    },
    Device: {
      enabled: true
    },
    Network: {
      enabled: true
    },
    App: {
      enabled: true
    }
  }
};

export default config;
