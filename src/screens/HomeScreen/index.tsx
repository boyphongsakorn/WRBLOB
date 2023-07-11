import React, { useCallback, useEffect } from 'react';
import type {PropsWithChildren} from 'react';
import {
  Alert,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  ToastAndroid,
  // Text,
  useColorScheme,
  View,
  // Button,
} from 'react-native';
import {NavigationContainer, useFocusEffect, useScrollToTop} from '@react-navigation/native';
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
  Card,
  Divider,
  Icon,
  Layout,
  MenuItem,
  OverflowMenu,
  Spinner,
  Text,
  TopNavigation,
} from '@ui-kitten/components';

function HomeScreen({navigation}) {
  const [newsData, setnewsData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [newscount, setnewscount] = React.useState(10);
  const ref = React.useRef(null);

  useScrollToTop(ref);
  // let newscount = 10;

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    if (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    ) {
      setnewscount(newscount + 10);
      if (newscount > 100) {
        setnewscount(100);
      }
      // if (!isLoading) {
      //   fetchnews();
      // }
      return true;
    }
  };

  const OpenURLButton = async ({url}) => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  const fetchnews = async () => {
    setIsLoading(true);
    ToastAndroid.show('กำลังโหลดข่าว', ToastAndroid.SHORT);
    try {
      const response = await fetch(
        'https://lotapi.pwisetthon.com/lotnews?count=' +
          newscount +
          '&fromapp=true',
      );
      console.log(newscount);
      const json = await response.json();
      //remove duplicate by title and link
      const unique = json.filter(
        (item, index, self) =>
          index ===
          self.findIndex(t => t.title === item.title && t.link === item.link),
      );
      //get only pubDate last 3 month
      const threeMonthAgo = unique.filter(
        item =>
          new Date(item.pubDate) >
          new Date(new Date().setMonth(new Date().getMonth() - 3)),
      );
      // setnewsData(
      //   unique.map((item) => (
      //     <>
      //       <Card
      //         header={() => (
      //           <Text category="h6" style={{margin: 10}}>
      //             {item.title}
      //           </Text>
      //         )}
      //         onPress={() => {
      //           OpenURLButton({url: item.link});
      //         }}>
      //         <Image
      //           style={{aspectRatio: 16 / 9}}
      //           source={{
      //             uri: item.image,
      //           }}
      //         />
      //       </Card>
      //     </>
      //   )),
      // );
      // setnewsData(unique);
      thaioil(threeMonthAgo);
    } catch (error) {}
  };

  const thaioil = async (news) => {
    try {
      const response = await fetch(
        'https://thaioilpriceapi-vercel.vercel.app/',
      );
      const json = await response.json();
      console.log(json[0][0]);
      //convert text dd/mm/yyyy to Date()
      const date = json[0][0].split('/');
      const dateObj = new Date(+date[2] - 543, date[1] - 1, +date[0]);
      //convert date to Sun, 20 Dec 2020 00:00:00 GMT
      const dateObj2 = dateObj.toUTCString();
      let newsData2: any = news;
      newsData2.push({
        title: 'ราคาน้ำมันวันนี้',
        link: 'http://gasprice.kapook.com/gasprice.php',
        image: 'https://topapi.pwisetthon.com/image?' + dateObj2,
        pubDate: dateObj2,
      });
      //order by pubDate
      newsData2.sort(function (a, b) {
        return new Date(b.pubDate) - new Date(a.pubDate);
      });
      setnewsData(newsData2);
      ToastAndroid.show('โหลดข่าวสำเร็จ', ToastAndroid.SHORT);
      setIsLoading(false);
    } catch (error) {}
  };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     fetchnews();
  //   }, []),
  // );

  useEffect(() => {
    fetchnews();
  }, []);

  return (
    <>
      <TopNavigation
        title="หน้าแรก"
        accessoryRight={() => (
          <Button
            appearance="ghost"
            size="medium"
            onPress={() => {
              navigation.navigate('ติดต่อเรา');
            }}>
            ติดต่อเรา
          </Button>
        )}
      />
      <Divider />
      <ScrollView
        ref={ref}
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent) && !isLoading) {
            fetchnews();
          }
        }}>
        {/* <Image
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
        /> */}
        {/* {newsData} */}
        {newsData.map((item) => (
          <>
            <Card
              header={() => (
                <Text category="h6" style={{margin: 10}}>
                  {item.title}
                </Text>
              )}
              onPress={() => {
                OpenURLButton({url: item.link});
              }}>
              <Image
                style={{aspectRatio: 16 / 9}}
                source={{
                  uri: item.image,
                }}
              />
            </Card>
          </>
        ))}
        {isLoading ? (
          <Text style={{textAlign: 'center'}}>
            <Spinner /> Loading...
          </Text>
        ) : null}
      </ScrollView>
    </>
  );
}

export default HomeScreen;
