import React, {useCallback, useEffect} from 'react';
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
  BackHandler,
  RefreshControl,
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
  ButtonGroup,
  Card,
  Icon,
  Input,
  Layout,
  Spinner,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';

function ShareScreen({navigation}) {
  const [historyData, setHistoryData] = React.useState([]);
  const [value, setValue] = React.useState('');
  // const [result, setResult] = React.useState('');
  const [isTooLate, setIsTooLate] = React.useState(false);
  const [numberType, setNumberType] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);

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
      console.log(json);
      setHistoryData(json);
    } catch (error) {}
  };

  const checkValue = async value => {
    try {
      console.log(value);
      // setResult('');
      // if (value.length > 6) {
      //   ToastAndroid.show('กรุณากรอกเลขสลากให้ถูกต้อง', ToastAndroid.SHORT);
      //   //remove text after 6 digit
      //   value = value.substring(0, 6);
      // }
      if (numberType == 'threeend') {
        if (value.length > 3) {
          ToastAndroid.show('กรุณากรอกเลขสลากฯสามหลัก', ToastAndroid.SHORT);
          //remove text after 6 digit
          value = value.substring(0, 3);
        }
      } else if (numberType == 'twoend') {
        if (value.length > 2) {
          ToastAndroid.show('กรุณากรอกเลขสลากฯสองหลัก', ToastAndroid.SHORT);
          //remove text after 6 digit
          value = value.substring(0, 2);
        }
      } else if (numberType == 'threefirst') {
        if (value.length > 3) {
          ToastAndroid.show('กรุณากรอกเลขสลากฯสามหลัก', ToastAndroid.SHORT);
          //remove text after 6 digit
          value = value.substring(0, 3);
        }
      } else if (numberType == 'sixgroup') {
        if (value.length > 6) {
          ToastAndroid.show('กรุณากรอกเลขสลากฯหกหลัก', ToastAndroid.SHORT);
          //remove text after 6 digit
          value = value.substring(0, 6);
        }
      } else if (numberType == '') {
        ToastAndroid.show('กรุณาเลือกประเภทเลขสลาก', ToastAndroid.SHORT);
      }
      setValue(value);
      // if (value.length >= 2 && value.length != 4 && value.length != 5) {
      //   // setResult('loading');
      //   const response = await fetch(
      //     'https://lotapi.pwisetthon.com/checklottery?by=' +
      //       lotData.info?.date +
      //       '&search=' +
      //       value,
      //   );
      //   const text = await response.text();
      //   // setResult(text);
      //   checkResult(text);
      //   console.log(text);
      // }
    } catch (error) {}
  };

  const SubmitLot = async () => {
    console.log('submit');
    console.log(value);
    console.log(numberType);
    if (value == '' || numberType == '') {
      ToastAndroid.show('กรุณากรอกเลขสลากหรือเลือกประเภท', 2000);
    } else {
      const LineProfile = await LineLogin.getProfile();
      if (LineProfile == null) {
        ToastAndroid.show('กรุณาเข้าสู่ระบบ', 2000);
        navigation.navigate('Login');
        return;
      }
      //create form data
      var formData = new FormData();
      formData.append('lineid', LineProfile.userID);
      formData.append('number', value);
      formData.append('numbertypewow', numberType);
      if (numberType.includes('three') && value.length < 3) {
        ToastAndroid.show('กรุณากรอกเลขสลากฯสามหลัก', 2000);
        return;
      }
      if (numberType.includes('two') && value.length < 2) {
        ToastAndroid.show('กรุณากรอกเลขสลากฯสองหลัก', 2000);
        return;
      }
      if (numberType.includes('six') && value.length < 6) {
        ToastAndroid.show('กรุณากรอกเลขสลากฯหกหลัก', 2000);
        return;
      }
      //send form data
      try {
        const response = await fetch(
          'https://lotto.teamquadb.in.th/addlott.php',
          {
            method: 'POST',
            body: formData,
          },
        );
        const json = await response.text();
        console.log(json);
        if (json.includes('ขอบคุณครับ')) {
          ToastAndroid.show('บันทึกข้อมูลสำเร็จ', 2000);
          setValue('');
          setNumberType('');
          historyLot();
        } else {
          ToastAndroid.show('บันทึกข้อมูลไม่สำเร็จ', 2000);
        }
      } catch (error) {}
    }
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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      historyLot();
      BackHandler.addEventListener('hardwareBackPress', () => {
        if (navigation.isFocused()) {
          navigation.navigate('สลากกินแบ่ง');
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

  // useEffect(() => {
  //   // latestLot();
  //   historyLot();
  //   BackHandler.addEventListener('hardwareBackPress', () => {
  //     if (navigation.isFocused()) {
  //       navigation.navigate('สลากกินแบ่ง');
  //       console.log('back');
  //     }
  //     return true;
  //   });
  // }, []);

  return (
    <>
      <TopNavigation
        title="แบ่งปันเลขสลากฯ"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Layout style={{alignItems: 'center'}}>
        <ButtonGroup>
          <Button
            style={{
              backgroundColor: numberType == 'threeend' ? '#00FF00' : '#3366FF',
            }}
            onPress={() => {
              setNumberType('threeend');
              checkValue(value);
            }}>
            สามตัวท้าย
          </Button>
          <Button
            style={{
              backgroundColor: numberType == 'twoend' ? '#00FF00' : '#3366FF',
            }}
            onPress={() => {
              setNumberType('twoend');
              checkValue(value);
            }}>
            สองตัวท้าย
          </Button>
          <Button
            style={{
              backgroundColor:
                numberType == 'threefirst' ? '#00FF00' : '#3366FF',
            }}
            onPress={() => {
              setNumberType('threefirst');
              checkValue(value);
            }}>
            สามตัวหน้า
          </Button>
          <Button
            style={{
              backgroundColor: numberType == 'sixgroup' ? '#00FF00' : '#3366FF',
            }}
            onPress={() => {
              setNumberType('sixgroup');
              checkValue(value);
            }}>
            หกตัว
          </Button>
        </ButtonGroup>
      </Layout>
      <Layout style={{flexDirection: 'row', justifyContent: 'center'}}>
        <Input
          placeholder="กรอกเลขสลาก"
          value={value}
          onChangeText={nextValue => checkValue(nextValue)}
          keyboardType="numeric"
          style={{margin: 10, flex: 4}}
        />
        <Button onPress={() => SubmitLot()} style={{margin: 10, marginLeft: 0}}>
          บันทึก
        </Button>
      </Layout>
      {historyData.length != 0 ? (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {historyData.map((item, index) => (
            <Card
              key={index}
              style={{margin: 10}}
              status={
                item.status == 'wait'
                  ? 'warning'
                  : checkResult(item.status) == 'ไม่ถูกรางวัล'
                  ? 'danger'
                  : 'success'
              }>
              <Text style={{textAlign: 'center', fontSize: 18}}>
                {/* งวดวันที่ {item.lotround.split('-')[2]}{' '}
                {numberToThaiMonth(item.lotround)}{' '}
                {parseInt(item.lotround.split('-')[0]) + 543} */}
                {item.status == 'wait'
                  ? 'งวดที่จะถึง'
                  : 'งวดวันที่ ' +
                    item.lotround.split('-')[2] +
                    ' ' +
                    numberToThaiMonth(item.lotround) +
                    ' ' +
                    (parseInt(item.lotround.split('-')[0]) + 543)}
              </Text>
              <Text style={{textAlign: 'center', fontSize: 18}}>
                {item.numberbuy}{' '}
                {item.numbertype == 'threeend'
                  ? '(สามตัวท้าย)'
                  : item.numbertype == 'threefirst'
                  ? '(สามตัวหน้า)'
                  : ''}
              </Text>
              <Text style={{textAlign: 'center', fontSize: 18}}>
                {/* {checkResult(item.status)} */}
                {item.status == 'wait' ? 'รอผล' : checkResult(item.status)}
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

export default ShareScreen;
