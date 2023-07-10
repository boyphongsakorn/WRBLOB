import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
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
import {useDispatch} from 'react-redux';
import {userLoginActions} from '../../store/userLogin';
import { Button, TopNavigation } from '@ui-kitten/components';

function LoginScreen({navigation}) {
  const dispatch = useDispatch();

  async function LoginLine() {
    try {
      const loginResult = await LineLogin.login();
      console.log(loginResult);
      await getLineProfile();
    } catch (error) {
      console.log(error);
    }
  }

  async function getLineProfile() {
    try {
      const profileResult = await LineLogin.getProfile();
      await AsyncStorage.setItem('lineID', profileResult.userID);
      dispatch(userLoginActions.setLogin());
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View>
      <TopNavigation title="ล็อกอิน" />
      {/* <Text>login screen</Text> */}
      {/* <Text>อยากรวย แต่ก็มีรายจ่ายอยู่ดี</Text> */}
      <Button size="medium" status="success" onPress={() => LoginLine()}>
        ล็อกอิน ผ่าน Line
      </Button>
    </View>
  );
}

export default LoginScreen;
