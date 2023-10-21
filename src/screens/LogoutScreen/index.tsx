import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  // Text,
  useColorScheme,
  View,
  // Button,
  Image
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
import {userLoginActions} from '../../store/userLogin';
import {useDispatch} from 'react-redux';
import {
  Avatar,
  Button,
  Card,
  Layout,
  Text,
  TopNavigation,
} from '@ui-kitten/components';
import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel';

function LogoutScreen({}) {
  const dispatch = useDispatch();

  const [displayName, setDisplayName] = React.useState('');
  const [pictureUrl, setPictureUrl] = React.useState(
    'https://topapi.pwisetthon.com/image',
  );
  const [lineId, setLineId] = React.useState('');

  const [historyData, setHistoryData] = React.useState([]);
  const viewCount = 5;

  async function getLineProfile() {
    try {
      if (displayName == '') {
        const profileResult = await LineLogin.getProfile();
        console.log(profileResult);
        setDisplayName(profileResult.displayName);
        setPictureUrl(profileResult.pictureURL ? profileResult.pictureURL : '');
        setLineId(profileResult.userID);
        historyLot();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const historyLot = async () => {
    try {
      if (lineId == '') {
        const profileResult = await LineLogin.getProfile();
        const response = await fetch(
          'https://lotto.teamquadb.in.th/getmylot.php?lineid=' +
            profileResult.userID,
        );
        const json = await response.json();
        setHistoryData(json);
        console.log(json);
      } else {
        const response = await fetch(
          'https://lotto.teamquadb.in.th/getmylot.php?lineid=' + lineId,
        );
        const json = await response.json();
        setHistoryData(json);
        console.log(json);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkResult = (value: string) => {
    try {
      if (value == 'wintwoend' || value == 'wtwoendis') {
        return 'ถูกรางวัลเลขท้ายสองตัว';
      } else if (value == 'winthreend' || value == 'wthreendis') {
        return 'ถูกรางวัลเลขท้ายสามตัว';
      } else if (value == 'winthrfirt' || value == 'wthrfirtis') {
        return 'ถูกรางวัลเลขหน้าสามตัว';
      } else if (value == 'winone') {
        return 'ถูกรางวัลที่หนึ่ง';
      } else if (value == 'winnearone') {
        return 'ถูกรางวัลใกล้เคียงรางวัลหนึ่ง';
      } else if (value == 'wintwo') {
        return 'ถูกรางวัลที่สอง';
      } else if (value == 'winthree') {
        return 'ถูกรางวัลที่สาม';
      } else if (value == 'winfour') {
        return 'ถูกรางวัลที่สี่';
      } else if (value == 'winfive') {
        return 'ถูกรางวัลที่ห้า';
      } else {
        return 'ไม่ถูกรางวัล';
      }
    } catch (error) {}
  };

  const lotType = (type: string, number: string) => {
    if (type === 'twoend') {
      return '0000' + number;
    } else if (type === 'threefirst') {
      return number + '000';
    } else if (type === 'threeend') {
      return '000' + number;
    } else if (type === 'sixgroup') {
      return number;
    }
  };

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

  React.useEffect(() => {
    getLineProfile();
  });

  return (
    <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'buttom'}}>
      <TopNavigation
        title={props => (
          <Text {...props} style={{fontSize: 16, fontWeight: 'bold'}}>
            {displayName}
          </Text>
        )}
      />

      <Layout
        style={{
          flexDirection: 'row',
        }}>
        <Layout
          style={{
            flex: 1,
            justifyContent: 'center',
            paddingLeft: 10,
            marginBottom: 10,
          }}
          level="1">
          <Avatar size="giant" source={{uri: pictureUrl}} />
        </Layout>

        <Layout
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          level="1">
          <Text style={{textAlign: 'center', fontSize: 16, fontWeight: 'bold'}}>
            0
          </Text>
          <Text style={{textAlign: 'center', fontSize: 16, fontWeight: 'bold'}}>
            คะแนน
          </Text>
        </Layout>

        <Layout
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          level="1">
          <Text style={{textAlign: 'center', fontSize: 16, fontWeight: 'bold'}}>
            0
          </Text>
          <Text style={{textAlign: 'center', fontSize: 16, fontWeight: 'bold'}}>
            ครั้งที่ถูก
          </Text>
        </Layout>
      </Layout>

      <Text
        style={{fontWeight: 'bold', marginLeft: 5, marginTop: 5}}
        category="h6">
        ประวัติ
      </Text>

      <Carousel
        style={{
          width: '100%',
          height: 240,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        width={280}
        height={210}
        pagingEnabled
        snapEnabled
        mode="horizontal-stack"
        loop
        data={historyData}
        modeConfig={{
          snapDirection: 'left',
          stackInterval: 18,
        }}
        customConfig={() => ({type: 'positive', viewCount})}
        renderItem={({index}) => (
          <Card
            style={{
              flex: 1,
              margin: 2,
              backgroundColor:
                historyData[index].status == 'wait'
                  ? '#ffffff'
                  : checkResult(historyData[index].status) == 'ไม่ถูกรางวัล'
                  ? '#ffffff'
                  : '#3CB371',
            }}
            header={
              <View>
                <Image
                  style={{aspectRatio: 16 / 10}}
                  source={{
                    // uri: 'https://imgul.teamquadb.in.th/images/2023/09/23/lotto_card.png',
                    uri:
                      'https://img.gs/fhcphvsghs/quality=low/https://anywhere.pwisetthon.com/http://108.61.183.221:8080/genlotimage?number=' +
                      lotType(
                        historyData[index].numbertype,
                        historyData[index].numberbuy,
                      ) +
                      '&date=' +
                      historyData[index].lotround.split('-')[2] +
                      '' +
                      historyData[index].lotround.split('-')[1] +
                      '' +
                      (parseInt(historyData[index].lotround.split('-')[0]) +
                        543),
                  }}
                />
              </View>
            }>
            <Text style={{textAlign: 'center', fontSize: 18}}>
              {historyData[index].status == 'wait'
                ? 'รอผล'
                : checkResult(historyData[index].status)}
            </Text>
          </Card>
        )}
      />

      {/* <Button title="Logout" onPress={() => LogoutLine()} /> */}
      <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'buttom'}}>
        <Button onPress={() => LogoutLine()}>ออกจากระบบ</Button>
      </View>
    </View>
  );
}

export default LogoutScreen;
