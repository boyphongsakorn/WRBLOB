/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider, useSelector} from 'react-redux';
import configureStore from './src/store';
import SplashScreen from 'react-native-splash-screen';

const {persistor, store} = configureStore();

SplashScreen.hide();

const RNRedux = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

// AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent(appName, () => RNRedux);
