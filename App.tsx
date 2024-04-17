
import React from 'react';

import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RecoilRoot } from 'recoil';
import Navigation from './src/navigation';

function App(): React.JSX.Element {
  return (
    <RecoilRoot>
      <SafeAreaProvider>
        <Navigation />
        <StatusBar />
      </SafeAreaProvider>
    </RecoilRoot>
  );
}

export default App;
