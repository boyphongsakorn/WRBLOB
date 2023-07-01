import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  // Text,
  useColorScheme,
  View,
  // Button,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import LineLogin from '@xmartlabs/react-native-line';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {userLoginActions} from '../../store/userLogin';
import {useDispatch} from 'react-redux';
import {Button, Layout, Text} from '@ui-kitten/components';

function LogoutScreen({navigation}) {
  const dispatch = useDispatch();

  async function LogoutLine() {
    try {
      await LineLogin.logout();
      await AsyncStorage.removeItem('lineID');
      dispatch(userLoginActions.clearLogin());
    } catch (error) {
      await AsyncStorage.removeItem('lineID');
      dispatch(userLoginActions.clearLogin());
      console.log(error);
    }
  }

  return (
    <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'buttom'}}>
      {/* <Button title="Logout" onPress={() => LogoutLine()} /> */}
      <Button onPress={() => LogoutLine()}>ออกจากระบบ</Button>
    </View>
  );
}

export default LogoutScreen;
