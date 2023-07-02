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
import {useDispatch, useSelector} from 'react-redux';
import {userLoginActions} from '../../store/userLogin';
import {
  Button,
  Card,
  Icon,
  Input,
  Layout,
  Spinner,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';

function HistoryScreen({navigation}) {
  const [historyData, setHistoryData] = React.useState([]);
  const [value, setValue] = React.useState('');
  const [result, setResult] = React.useState('');

  //   const latestLot = async () => {
  //     try {
  //       const response = await fetch(
  //         'https://lotapi.pwisetthon.com/lastlot?info=true',
  //       );
  //       const json = await response.json();
  //       setlotData(json);
  //     } catch (error) {}
  //   };

  const historyLot = async () => {
    try {
      const LineProfile = await LineLogin.getProfile();
      console.log(LineProfile);
      const response = await fetch(
        'https://lotto.teamquadb.in.th/getmylot.php?lineid=' +
          LineProfile.userID,
      );
      const json = await response.json();
      setHistoryData(json);
    } catch (error) {}
  };

  const checkValue = async value => {
    try {
      console.log(value);
      setResult('');
      if (value.length > 6) {
        ToastAndroid.show('กรุณากรอกเลขสลากให้ถูกต้อง', ToastAndroid.SHORT);
        //remove text after 6 digit
        value = value.substring(0, 6);
      }
      setValue(value);
      if (value.length >= 2 && value.length != 4 && value.length != 5) {
        setResult('loading');
        const response = await fetch(
          'https://lotapi.pwisetthon.com/checklottery?by=' +
            lotData.info?.date +
            '&search=' +
            value,
        );
        const text = await response.text();
        // setResult(text);
        checkResult(text);
        console.log(text);
      }
    } catch (error) {}
  };

  const checkResult = value => {
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

  const numberToThaiMonth = month => {
    if (month.length > 2) {
      month = month.substring(5, 7);
    }
    console.log(month);
    switch (month) {
      case '01':
        return 'มกราคม';
      case '02':
        return 'กุมภาพันธ์';
      case '03':
        return 'มีนาคม';
      case '04':
        return 'เมษายน';
      case '05':
        return 'พฤษภาคม';
      case '06':
        return 'มิถุนายน';
      case '07':
        return 'กรกฎาคม';
      case '08':
        return 'สิงหาคม';
      case '09':
        return 'กันยายน';
      case '10':
        return 'ตุลาคม';
      case '11':
        return 'พฤศจิกายน';
      case '12':
        return 'ธันวาคม';
    }
  };

  const BackIcon = (props): IconElement => (
    <Icon
      {...props}
      name="arrow-back"
      onPress={() => navigation.navigate('สลากกินแบ่ง')}
    />
  );

  const BackAction = (): React.ReactElement => (
    <TopNavigationAction icon={BackIcon} />
  );

  useEffect(() => {
    // latestLot();
    historyLot();
  }, []);

  return (
    <>
      <TopNavigation
        title="ประวัติสลากกินแบ่งฯที่เคยบันทึก"
        alignment="center"
        accessoryLeft={BackAction}
      />
      {historyData.length != 0 ? (
        <ScrollView>
          {historyData.map((item, index) => (
            <Card key={index} style={{margin: 10}}>
              <Text style={{textAlign: 'center', fontSize: 18}}>
                งวดวันที่ {item.lotround.split('-')[2]}{' '}
                {numberToThaiMonth(item.lotround)}{' '}
                {parseInt(item.lotround.split('-')[0]) + 543}
              </Text>
              <Text style={{textAlign: 'center', fontSize: 18}}>
                {item.numberbuy}
              </Text>
              <Text style={{textAlign: 'center', fontSize: 18}}>
                {checkResult(item.status)}
              </Text>
            </Card>
          ))}
        </ScrollView>
      ) : (
        <View>
          <Text style={{textAlign: 'center'}}>
            <Spinner /> Loading...
          </Text>
        </View>
      )}
    </>
  );
}

export default HistoryScreen;
