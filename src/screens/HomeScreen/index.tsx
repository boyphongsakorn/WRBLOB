import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  Image,
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
import {
  Button,
  Divider,
  Layout,
  Text,
  TopNavigation,
} from '@ui-kitten/components';

function HomeScreen({navigation}) {
  return (
    <>
      <TopNavigation title="หน้าแรก" />
      <Divider />
      <ScrollView>
        <Image
          style={{aspectRatio: 1 / 1}}
          source={{
            uri: 'https://topapi.pwisetthon.com/image',
          }}
        />
        <Image
          style={{aspectRatio: 3 / 2}}
          source={{
            uri: 'https://lotimg.pwisetthon.com/?latest=true',
          }}
        />
      </ScrollView>
    </>
  );
}

export default HomeScreen;
