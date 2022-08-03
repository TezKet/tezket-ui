// In App.js in a new project

import * as React from 'react';

import { NativeBaseProvider } from "native-base"

import { BaseTheme } from './src/theme';
import config from './nativebase.config';
import { Root } from './src/components/RootComponent'
import WallProvider from './src/providers/WalletContext'

// import { PaymentForm } from 'react-square-web-payments-sdk';
// {/* <PaymentForm {...props}> */}
// {/* </PaymentForm> */}

function App() {

  return (
    <NativeBaseProvider 
      theme={BaseTheme}
      config={config}
    >
      <WallProvider>
        <Root/>
      </WallProvider>
    </NativeBaseProvider>
  );
}

export default App;