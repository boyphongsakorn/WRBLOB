/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

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
  Button,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import LogoutScreen from './src/screens/LogoutScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Provider, useSelector} from 'react-redux';
import configureStore from './src/store';
import {PersistGate} from 'redux-persist/integration/react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import * as eva from '@eva-design/eva';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {ApplicationProvider, Icon, IconElement, IconRegistry, Layout, Text} from '@ui-kitten/components';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const {isUserLogin} = useSelector(state => ({
    isUserLogin: state.userLogin,
  }));

  const {persistor, store} = configureStore();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    // <Provider store={store}>
    // <PersistGate loading={null} persistor={persistor}>
    //   <SafeAreaProvider>
    //     <ApplicationProvider {...eva} theme={eva.light}>
    //       <NavigationContainer>
    //         {isUserLogin ? (
    //           <Tab.Navigator screenOptions={{headerShown: false}}>
    //             <Tab.Screen name="Profile" component={ProfileScreen} />
    //             <Tab.Screen name="Logout" component={LogoutScreen} />
    //           </Tab.Navigator>
    //         ) : (
    //           <Stack.Navigator
    //             screenOptions={{
    //               headerShown: false,
    //             }}>
    //             <Stack.Screen name="Home" component={LoginScreen} />
    //           </Stack.Navigator>
    //         )}
    //       </NavigationContainer>
    //     </ApplicationProvider>
    //   </SafeAreaProvider>
    // </PersistGate>
    // </Provider>
    <PersistGate loading={null} persistor={persistor}>
      <SafeAreaProvider>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={eva.light}>
          <NavigationContainer>
            <Tab.Navigator screenOptions={{headerShown: false}}>
              <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  tabBarIcon: ({color, size}) => (
                    <Icon
                      name="home-outline"
                      fill={color}
                      width={size}
                      height={size}
                    />
                  ),
                }}
              />
              {isUserLogin ? (
                <Tab.Screen
                  name="Logout"
                  component={LogoutScreen}
                  options={{
                    tabBarIcon: ({color, size}) => (
                      <Icon
                        name="person-outline"
                        fill={color}
                        width={size}
                        height={size}
                      />
                    ),
                  }}
                />
              ) : (
                <Tab.Screen
                  name="Login"
                  component={LoginScreen}
                  options={{
                    tabBarIcon: ({color, size}) => (
                      <Icon
                        name="person-outline"
                        fill={color}
                        width={size}
                        height={size}
                      />
                    ),
                  }}
                />
              )}
            </Tab.Navigator>
          </NavigationContainer>
        </ApplicationProvider>
      </SafeAreaProvider>
    </PersistGate>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
