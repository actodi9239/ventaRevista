import React from 'react';
import {FirebaseAppProvider} from 'reactfire';
import firebaseconf from './firebase-config';
import AppStack from './stack';
import 'react-native-gesture-handler';

const App = () => {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseconf}>
        <AppStack />
    </FirebaseAppProvider>
  );
};
export default App;
