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
  Input,
  Layout,
  Spinner,
  Text,
  TopNavigation,
} from '@ui-kitten/components';

function LotScreen({navigation}) {
  const [lotData, setlotData] = React.useState([]);
  const [value, setValue] = React.useState('');
  const [result, setResult] = React.useState('');

  const {isUserLogin} = useSelector(state => ({
    isUserLogin: state.userLogin,
  }));

  const latestLot = async () => {
    try {
      const todayresponse = await fetch('https://lotapi.pwisetthon.com/reto');
      const today = await todayresponse.text();
      if (today == 'yes') {
        const response = await fetch('https://lotapi.pwisetthon.com');
        const json = await response.json();
        setlotData({
          info: {
            date:
              new Date().getDate() +
              '' +
              (new Date().getMonth() + 1) +
              '' +
              new Date().getFullYear() +
              543,
          },
          win: json[0][1],
          threefirst: json[1][1] + ',' + json[1][2],
          threeend: json[2][1] + ',' + json[2][2],
          twoend: json[3][1],
        });
      } else {
        const response = await fetch(
          'https://lotapi.pwisetthon.com/lastlot?info=true',
        );
        const json = await response.json();
        setlotData(json);
      }
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

  const checkResult = async value => {
    try {
      if (value == '111111') {
        setResult('ถูกรางวัลที่ 1');
      } else if (value == '111112') {
        setResult('ถูกรางวัลข้างเคียงรางวัลที่ 1');
      } else if (value == '000022') {
        setResult('ถูกรางวัลเลขท้าย 2 ตัว');
      } else if (value == '333000') {
        setResult('ถูกรางวัลเลขท้าย 3 ตัว');
      } else if (value == '000333') {
        setResult('ถูกรางวัลเลขท้าย 3 ตัว');
      } else if (value == '222222') {
        setResult('ถูกรางวัลที่ 2');
      } else if (value == '333333') {
        setResult('ถูกรางวัลที่ 3');
      } else if (value == '444444') {
        setResult('ถูกรางวัลที่ 4');
      } else if (value == '555555') {
        setResult('ถูกรางวัลที่ 5');
      } else {
        setResult('ไม่ถูกรางวัล');
      }
    } catch (error) {}
  };

  const numberToThaiMonth = month => {
    if (month.length > 2) {
      month = month.substring(2, 4);
    }
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

  useEffect(() => {
    latestLot();
  }, []);

  return (
    <View>
      <TopNavigation title="สลากกินแบ่ง" alignment="center" />
      {lotData.length != 0 ? (
        <View>
          <Text style={{textAlign: 'center', fontSize: 18, marginTop: 10}}>
            สลากกินแบ่งรัฐบาล ประจำงวดที่{' '}
            {parseInt(lotData.info?.date.substring(0, 2))}{' '}
            {lotData.info ? numberToThaiMonth(lotData.info?.date) : ''}{' '}
            {lotData.info?.date.substring(4, 8)}
          </Text>
          <Input
            placeholder="ค้นหาเลขสลาก"
            value={value}
            onChangeText={nextValue => checkValue(nextValue)}
            size="large"
            style={{
              marginTop: 10,
            }}
            keyboardType="numeric"
          />
          {result != '' && result != 'loading' ? (
            <>
              <Card
                style={{marginTop: 10}}
                status={result == 'ไม่ถูกรางวัล' ? 'danger' : 'success'}>
                <Text
                  style={{
                    textAlign: 'center',
                    paddingTop: 10,
                    paddingBottom: 10,
                  }}>
                  {result}
                </Text>
              </Card>
            </>
          ) : result == 'loading' ? (
            <Text style={{marginTop: 10, textAlign: 'center'}}>
              <Spinner /> Loading...
            </Text>
          ) : (
            <></>
          )}
          <Layout
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <Card
              style={{flex: 1, margin: 2}}
              header={
                <View>
                  <Text category="h5" style={{textAlign: 'center'}}>
                    รางวัลที่ 1
                  </Text>
                </View>
              }>
              <Text style={{textAlign: 'center', fontSize: 18}}>
                {lotData.win}
              </Text>
            </Card>
            <Card
              style={{margin: 2}}
              header={
                <View>
                  <Text style={{textAlign: 'center', fontSize: 14}}>
                    รางวัลข้างเคียงรางวัลที่ 1
                  </Text>
                </View>
              }>
              <Text style={{textAlign: 'center', fontSize: 18}}>
                {parseInt(lotData.win) + 1} , {parseInt(lotData.win) - 1}
              </Text>
            </Card>
          </Layout>
          <Layout
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Card
              style={{flex: 1, margin: 2}}
              header={
                <View>
                  <Text style={{textAlign: 'center'}}>รางวัลเลขหน้า 3 ตัว</Text>
                </View>
              }>
              <Text style={{textAlign: 'center', fontSize: 18}}>
                {lotData.threefirst.split(',')[0]}{' '}
                {lotData.threefirst.split(',')[1]}
              </Text>
            </Card>
            <Card
              style={{flex: 1, margin: 2}}
              header={
                <View>
                  <Text style={{textAlign: 'center'}}>รางวัลเลขท้าย 3 ตัว</Text>
                </View>
              }>
              <Text style={{textAlign: 'center', fontSize: 18}}>
                {lotData.threeend.split(',')[0]}{' '}
                {lotData.threeend.split(',')[1]}
              </Text>
            </Card>
          </Layout>
          <Card
            header={
              <View>
                <Text style={{textAlign: 'center'}}>รางวัลเลขท้าย 2 ตัว</Text>
              </View>
            }>
            <Text style={{textAlign: 'center', fontSize: 18}}>
              {lotData.twoend}
            </Text>
          </Card>
          {isUserLogin ? (
            <Layout
              style={{
                flexDirection: 'column',
                marginTop: 10,
              }}>
              <Layout style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Button
                  onPress={() => navigation.navigate('ประวัติสลากกินแบ่ง')}>
                  ประวัติเลขสลากฯของคุณ
                </Button>
                <Button
                  style={{display: 'none'}}
                  onPress={() => navigation.navigate('แบ่งปันเลขสลาก')}>
                  แบ่งปันเลขสลากกินแบ่งฯ
                </Button>
              </Layout>
            </Layout>
          ) : (
            <></>
          )}
          {/* <Layout
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              marginTop: 10,
            }}>
            <Layout style={{flexDirection: 'column'}}>
              <Layout style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Card
                  header={
                    <View>
                      <Text category="h6">รางวัลที่ 1</Text>
                    </View>
                  }>
                  <Text style={{textAlign: 'center', fontSize: 18}}>
                    {lotData.win}
                  </Text>
                </Card>
                <Card
                  header={
                    <View>
                      <Text category="h6">รางวัลข้างเคียงรางวัลที่ 1</Text>
                    </View>
                  }>
                  <Text style={{textAlign: 'center', fontSize: 18}}>
                    {parseInt(lotData.win) + 1} , {parseInt(lotData.win) - 1}
                  </Text>
                </Card>
              </Layout>
            </Layout>
            <Layout style={{flexDirection: 'column'}}>
              <Card
                header={
                  <View>
                    <Text category="h6">รางวัลที่ 2</Text>
                  </View>
                }>
                <Text style={{textAlign: 'center', fontSize: 18}}>
                  {lotData.threefirst}
                </Text>
              </Card>
            </Layout>
          </Layout> */}
        </View>
      ) : (
        <View>
          <Text style={{textAlign: 'center', marginTop: 10}}>
            <Spinner /> Loading...
          </Text>
        </View>
      )}
    </View>
  );
}

export default LotScreen;
