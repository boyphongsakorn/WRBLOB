import React, {useCallback, useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Alert,
  Image,
  Linking,
  PermissionsAndroid,
  RefreshControl,
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
import {
  NavigationContainer,
  useFocusEffect,
  useScrollToTop,
} from '@react-navigation/native';
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
import messaging from '@react-native-firebase/messaging';
import notifee, {EventType, AndroidStyle} from '@notifee/react-native';

function HomeScreen({navigation}) {
  const [newsData, setnewsData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [newscount, setnewscount] = React.useState(10);
  const [refreshing, setRefreshing] = React.useState(false);
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
      // if youtube link
      if (url.includes('youtube')) {
        //   const youtubeurl = url.split('url:')[1];
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
      // Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  const firsttime = async () => {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    console.log(token);
    messaging()
      .subscribeToTopic('all')
      .then(() => {
        console.log('Subscribed to topic!');
      });
  };

  const fetchnews = async () => {
    setIsLoading(true);
    ToastAndroid.show('กำลังโหลดข่าว', ToastAndroid.SHORT);
    try {
      // const response = await fetch(
      //   'https://lotapi3.pwisetthon.com/lotnews?count=' +
      //     newscount +
      //     '&fromapp=true',
      // );
      const response = await fetch(
        'https://raw.githubusercontent.com/boyphongsakorn/testrepo/main/latestnews.json',
      );
      console.log(newscount);
      let json = await response.json();
      if (newscount >= 50 || json.statusCode == 500) {
        const realResponse = await fetch(
          'https://lotapi.pwisetthon.com/lotnews?count=' +
            newscount +
            '&fromapp=true',
        );
        json = await realResponse.json();
        if (json.statusCode == 500) {
          const backupResponse = await fetch(
            'https://raw.githubusercontent.com/boyphongsakorn/testrepo/main/latestnews.json',
          );
          json = await backupResponse.json();
        }
      }
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
      // console.log(json[0][0]);
      //convert text dd/mm/yyyy to Date()
      const date = json[0][0].split('/');
      const dateObj = new Date(+date[2] - 543, date[1] - 1, +date[0]);
      try {
        const timeresponse = await fetch(
          'https://oil-price.bangchak.co.th/apioilprice2/th',
        );
        const timejson = await timeresponse.json();
        //get time from OilMessageTime
        const time = timejson[0].OilMessageTime.split(':');
        dateObj.setHours(time[0]);
        dateObj.setMinutes(time[1]);
        dateObj.setSeconds(0);
      } catch (error) {
        console.log(error);
        //set time to 17:30:00
        dateObj.setHours(17);
        dateObj.setMinutes(30);
        dateObj.setSeconds(0);
      }
      //convert date to Sun, 20 Dec 2020 00:00:00 GMT
      const dateObj2 = dateObj.toUTCString();
      let newsData2: any = news;
      newsData2.push({
        title: 'ราคาน้ำมันวันนี้',
        link: 'http://gasprice.kapook.com/gasprice.php',
        image:
          'https://img.gs/fhcphvsghs/1280x720/https://topapi.pwisetthon.com/image?' +
          dateObj2,
        pubDate: dateObj2,
      });
      //order by pubDate
      newsData2.sort(function (a, b) {
        return new Date(b.pubDate) - new Date(a.pubDate);
      });
      // setnewsData(newsData2);
      // ToastAndroid.show('โหลดข่าวสำเร็จ', ToastAndroid.SHORT);
      // setIsLoading(false);
      thaigold(newsData2);
    } catch (error) {
      console.log(error);
    }
  };

  const thaigold = async (news) => {
    try {
      const response = await fetch(
        'https://api.chnwt.dev/thai-gold-api/latest',
      );
      const json = await response.json();
      // console.log(json);
      //convert text dd/mm/yyyy to Date()
      let dateObj = new Date();
      if (json.response.date != '') {
        const date = json.response.date.split(' ');
        dateObj = new Date(
          +date[2] - 543,
          parseInt(thaimonthtonumber(date[1])) - 1,
          +date[0],
        );
      }
      //get update_time from api
      if (json.response.update_time != '') {
        const time = json.response.update_time.split(' ')[1].split(':');
        //convert date to Sun, 20 Dec 2020 00:00:00 GMT
        dateObj.setHours(+time[0]);
        dateObj.setMinutes(+time[1]);
        dateObj.setSeconds(0);
      } else {
        dateObj.setHours(17);
        dateObj.setMinutes(30);
        dateObj.setSeconds(0);
      }
      //set time to 09:30:00 GMT+0700 (Indochina Time)
      const dateObj2 = dateObj.toUTCString();
      let newsData2: any = news;
      if (
        json.response.price.gold.buy === '' ||
        json.response.price.gold.sell === ''
      ) {
        newsData2.push({
          title:
            'ราคาทองคำวันนี้ ทองแท่ง ซื้อ ' +
            json.response.price.gold_bar.buy +
            ' ขาย ' +
            json.response.price.gold_bar.sell,
          link: 'https://www.goldtraders.or.th/',
          image:
            'https://img.gs/fhcphvsghs/quality=low/https://s.isanook.com/mn/0/ud/181/907947/gold.jpg?ip/crop/w670h402/q80/jpg',
          pubDate: dateObj2,
        });
      } else {
        newsData2.push({
          title:
            'ราคาทองคำวันนี้ ทองรูปพรรณ ซื้อ ' +
            json.response.price.gold.buy +
            ' ขาย ' +
            json.response.price.gold.sell +
            ' ทองแท่ง ซื้อ ' +
            json.response.price.gold_bar.buy +
            ' ขาย ' +
            json.response.price.gold_bar.sell,
          link: 'https://www.goldtraders.or.th/',
          image:
            'https://img.gs/fhcphvsghs/quality=low/https://s.isanook.com/mn/0/ud/181/907947/gold.jpg?ip/crop/w670h402/q80/jpg',
          pubDate: dateObj2,
        });
      }
      //order by pubDate
      newsData2.sort(function (a, b) {
        return new Date(b.pubDate) - new Date(a.pubDate);
      });
      setnewsData(newsData2);
      setIsLoading(false);
      ToastAndroid.show('โหลดข่าวสำเร็จ', ToastAndroid.SHORT);
    } catch (error) {
      console.log(error);
    }
  };

  // const onDisplayNotification = async () => {
  //   const channelId = await notifee.createChannel({
  //     id: 'default',
  //     name: 'Default Channel',
  //   });

  //   await notifee.displayNotification({
  //     title: 'Notification Title',
  //     body: 'Main body content of the notification',
  //     android: {
  //       channelId,
  //       smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
  //       // pressAction is needed if you want the notification to open the app when pressed
  //       pressAction: {
  //         id: 'default',
  //       },
  //     },
  //   });
  // };

  const thaimonthtonumber = (month) => {
    switch (month) {
      case 'มกราคม':
        return '01';
      case 'กุมภาพันธ์':
        return '02';
      case 'มีนาคม':
        return '03';
      case 'เมษายน':
        return '04';
      case 'พฤษภาคม':
        return '05';
      case 'มิถุนายน':
        return '06';
      case 'กรกฎาคม':
        return '07';
      case 'สิงหาคม':
        return '08';
      case 'กันยายน':
        return '09';
      case 'ตุลาคม':
        return '10';
      case 'พฤศจิกายน':
        return '11';
      case 'ธันวาคม':
        return '12';
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     fetchnews();
  //   }, []),
  // );

  useEffect(() => {
    firsttime();
    fetchnews();
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    // onDisplayNotification();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });

      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));

      if (remoteMessage.notification?.android?.imageUrl) {
        //if remoteMessage.notification?.body have | and url: first split | and get url: second
        if (remoteMessage.notification?.body?.includes('|')) {
          const url = remoteMessage.notification?.body?.split('|')[1];
          await notifee.displayNotification({
            title: remoteMessage.notification?.title,
            body: remoteMessage.notification?.body?.split('|')[0],
            android: {
              channelId,
              smallIcon: 'ic_noti', // optional, defaults to 'ic_launcher'.
              style: {
                type: AndroidStyle.BIGPICTURE,
                picture: remoteMessage.notification?.android?.imageUrl,
              },
              // pressAction is needed if you want the notification to open the app when pressed
              pressAction: {
                id: 'youtube',
                launchActivity: url?.split('url:')[1],
              },
            },
          });
        } else {
          await notifee.displayNotification({
            title: remoteMessage.notification?.title,
            body: remoteMessage.notification?.body,
            android: {
              channelId,
              smallIcon: 'ic_noti', // optional, defaults to 'ic_launcher'.
              style: {
                type: AndroidStyle.BIGPICTURE,
                picture: remoteMessage.notification?.android?.imageUrl,
              },
              // pressAction is needed if you want the notification to open the app when pressed
              pressAction: {
                id: 'default',
              },
            },
          });
        }
      } else {
        await notifee.displayNotification({
          title: remoteMessage.notification?.title,
          body: remoteMessage.notification?.body,
          android: {
            channelId,
            smallIcon: 'ic_noti', // optional, defaults to 'ic_launcher'.
            // pressAction is needed if you want the notification to open the app when pressed
            pressAction: {
              id: 'default',
            },
          },
        });
      }

      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    notifee.onForegroundEvent(({type, detail}) => {
      console.log('App opened from notification', type, detail);
      if (type === EventType.PRESS) {
        console.log('User pressed on notification');
        // console.log(detail.notification.android.pressAction.launchActivity);
        // open link from notification
        if (detail?.notification?.android?.pressAction?.launchActivity) {
          OpenURLButton({
            url: detail.notification.android.pressAction.launchActivity,
          });
        }
      }
    });

    notifee.onBackgroundEvent(async ({type, detail}) => {
      console.log('App opened from notification', type, detail);
      if (type === EventType.ACTION_PRESS) {
        console.log('User pressed on notification');
        // console.log(detail.notification.android.pressAction.launchActivity);
        // open link from notification
        if (detail?.notification?.android?.pressAction?.launchActivity) {
          OpenURLButton({
            url: detail.notification.android.pressAction.launchActivity,
          });
        }
      }
    });

    return unsubscribe;
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ref={ref}
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent) && !isLoading) {
            if (newscount == 10) {
              setnewscount(newscount + 10);
            }
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
        {/* <Card
          onPress={() => {
            OpenURLButton({url: 'https://xn--42cah7d0cxcvbbb9x.com/'});
          }}
        >
          <Image
            style={{aspectRatio: 16 / 9}}
            source={{
              uri: 'https://img.gs/fhcphvsghs/quality=low/https://s.isanook.com/mn/0/ud/181/907947/gold.jpg?ip/crop/w670h402/q80/jpg',
            }}
          />
          <Text>ราคาทองวันนี้ ทองรูปพรรณ 32,550.00 31,381.20</Text>
          <Text>ทองคำแท่ง 32,050.00 31,950.00</Text>
        </Card> */}
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
            <Spinner /> กำลังโหลด...
          </Text>
        ) : null}
      </ScrollView>
    </>
  );
}

export default HomeScreen;
