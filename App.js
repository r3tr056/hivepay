import app from '@react-native-firebase/app';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, useColorScheme } from 'react-native';
import { Provider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RecoilRoot } from 'recoil';
import useCachedResources from './hooks/useCachedResources';
import Navigation from './navigation';
import { FIREBASE_CONFIG } from './services/config';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  }

  if (!app.apps.length) {
    app.initializeApp(FIREBASE_CONFIG);
  }

  return (
    <RecoilRoot>
      <SafeAreaProvider>
        <Provider theme={colorScheme}>
          <Navigation colorScheme={colorScheme} />
        </Provider>
        <StatusBar />
      </SafeAreaProvider>
    </RecoilRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
