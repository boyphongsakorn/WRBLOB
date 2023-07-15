import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  //   Text,
  useColorScheme,
  View,
  //   Button,
  ToastAndroid,
  Linking,
  BackHandler,
} from 'react-native';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
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
import {useDispatch, useSelector} from 'react-redux';
import {userLoginActions} from '../../store/userLogin';
import {
  Button,
  Card,
  Icon,
  IconElement,
  Input,
  Layout,
  Spinner,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';

function ContactUsScreen({navigation}) {
  const [historyData, setHistoryData] = React.useState([]);
  const [value, setValue] = React.useState('');
  const [result, setResult] = React.useState('');

  const BackIcon = (props): IconElement => (
    <Icon
      {...props}
      name="arrow-back"
      onPress={() => navigation.navigate('หน้าแรก')}
    />
  );

  const BackAction = (): React.ReactElement => (
    <TopNavigationAction icon={BackIcon} />
  );

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      BackHandler.addEventListener('hardwareBackPress', () => {
        if (navigation.isFocused()) {
          navigation.navigate('หน้าแรก');
          console.log('back');
        }
        return true;
      });

      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [navigation]),
  );

  return (
    <>
      <TopNavigation
        title="ติดต่อเรา"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text category="h3">ติดต่อเรา</Text>
        <Text
          category="h6"
          onPress={() => Linking.openURL('mailto:contact@teamquadb.in.th')}>
          contact@teamquadb.in.th
        </Text>
      </Layout>
    </>
  );
}

export default ContactUsScreen;
