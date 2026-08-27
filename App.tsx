// TH1 | 23646871 | NGUYỄN HUỲNH PHƯỚC DANH | #STAMP
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from '@screens/HomeScreen';

const App = () => {
  return (
    <SafeAreaProvider>
      <HomeScreen />
    </SafeAreaProvider>
  );
};

export default App;
