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
  IndexPath,
  Input,
  Layout,
  Select,
  SelectItem,
  Spinner,
  Text,
  TopNavigation,
} from '@ui-kitten/components';

function LotScreen({navigation}) {
  const [lotData, setlotData] = React.useState([]);
  const [fullLotData, setfullLotData] = React.useState([]);
  const [allDate, setAllDate] = React.useState([]);
  const [value, setValue] = React.useState('');
  const [result, setResult] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));
  const [dataLoading, setDataLoading] = React.useState(false);

  const {isUserLogin} = useSelector(state => ({
    isUserLogin: state.userLogin,
  }));

  const latestLot = async date => {
    try {
      const todayresponse = await fetch('https://lotapi.pwisetthon.com/reto');
      const today = await todayresponse.text();
      if (date == null) {
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
          fullInfo(null);
        } else {
          const response = await fetch(
            'https://lotapi.pwisetthon.com/lastlot?info=true',
          );
          const json = await response.json();
          setlotData(json);
          fullInfo(json.info?.date);
        }
      } else {
        setDataLoading(true);
        const response = await fetch(
          'https://lottsanook-cfworker.boy1556.workers.dev/index3?date=' + date,
        );
        const json = await response.json();
        setlotData({
          info: {
            date: date,
          },
          win: json[0][1],
          threefirst: json[1][1] + ',' + json[1][2],
          threeend: json[2][1] + ',' + json[2][2],
          twoend: json[3][1],
        });
        fullInfo(date);
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
        const todayresponse = await fetch('https://lotapi.pwisetthon.com/reto');
        const today = await todayresponse.text();
        if (today == 'yes') {
          const response = await fetch(
            'https://lotapi.pwisetthon.com/checklottery?by=' +
              ('0' + new Date().getDate()).slice(-2) +
              (new Date().getMonth() + 1) +
              (new Date().getFullYear() + 543) +
              '&search=' +
              value,
          );
          const text = await response.text();
          // setResult(text);
          checkResult(text);
          console.log(text);
        } else {
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
        setResult('ถูกรางวัลเลขหน้า 3 ตัว');
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

  const fullInfo = async date => {
    try {
      console.log(date);
      const response = await fetch(
        'https://lotapi.pwisetthon.com/index3?date=' + date,
      );
      let json = await response.json();
      if (dataLoading) {
        const fastResponse = await fetch(
          'https://lottsanook-cfworker.boy1556.workers.dev/index3?date=' + date,
        );
        json = await fastResponse.json();
      }
      setfullLotData(json);
      console.log(json);
      getAllDate();
    } catch (error) {}
  };

  const getAllDate = async () => {
    const response = await fetch('https://lotapi.pwisetthon.com/god');
    const json = await response.json();
    setAllDate(json.reverse());
    setDataLoading(false);
  };

  const selectValue = index => {
    setSelectedIndex(index);
    // fullInfo(allDate[index.row]);
    latestLot(allDate[index.row]);
  };

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      latestLot(null);
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

  // useEffect(() => {
  //   latestLot();
  // }, []);

  return (
    <ScrollView>
      <TopNavigation title="สลากกินแบ่ง" alignment="center" />
      {lotData.length != 0 ? (
        <View>
          <Layout
            style={{
              flexDirection: 'row',
            }}>
            <Text style={{textAlign: 'center', fontSize: 18, marginTop: 10}}>
              สลากกินแบ่งรัฐบาล ประจำงวดที่
            </Text>
            <Select
              style={{flex: 1, marginLeft: 10}}
              value={
                allDate.length > 0
                  ? parseInt(allDate[selectedIndex.row].substring(0, 2)) +
                    ' ' +
                    numberToThaiMonth(
                      allDate[selectedIndex.row].substring(2, 4),
                    ) +
                    ' ' +
                    allDate[selectedIndex.row].substring(4, 8)
                  : ''
              }
              onSelect={index => selectValue(index)}>
              {allDate.length > 0 ? (
                allDate.map((item, index) => (
                  <SelectItem
                    key={index}
                    title={
                      parseInt(item.substring(0, 2)) +
                      ' ' +
                      numberToThaiMonth(item.substring(2, 4)) +
                      ' ' +
                      item.substring(4, 8)
                    }
                  />
                ))
              ) : (
                <></>
              )}
            </Select>
          </Layout>
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
              {dataLoading ? (
                <Text style={{textAlign: 'center'}}>
                  <Spinner /> กำลังโหลด...
                </Text>
              ) : (
                <Text style={{textAlign: 'center', fontSize: 18}}>
                  {lotData.win}
                </Text>
              )}
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
              {dataLoading ? (
                <Text style={{textAlign: 'center'}}>
                  <Spinner /> กำลังโหลด...
                </Text>
              ) : (
                <Text style={{textAlign: 'center', fontSize: 18, marginTop: 5}}>
                  {parseInt(lotData.win) + 1} , {parseInt(lotData.win) - 1}
                </Text>
              )}
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
              {dataLoading ? (
                <Text style={{textAlign: 'center'}}>
                  <Spinner /> กำลังโหลด...
                </Text>
              ) : (
                <Text style={{textAlign: 'center', fontSize: 18}}>
                  {lotData.threefirst.split(',')[0]}{' '}
                  {lotData.threefirst.split(',')[1]}
                </Text>
              )}
            </Card>
            <Card
              style={{flex: 1, margin: 2}}
              header={
                <View>
                  <Text style={{textAlign: 'center'}}>รางวัลเลขท้าย 3 ตัว</Text>
                </View>
              }>
              {dataLoading ? (
                <Text style={{textAlign: 'center'}}>
                  <Spinner /> กำลังโหลด...
                </Text>
              ) : (
                <Text style={{textAlign: 'center', fontSize: 18}}>
                  {lotData.threeend.split(',')[0]}{' '}
                  {lotData.threeend.split(',')[1]}
                </Text>
              )}
            </Card>
          </Layout>
          <Card
            header={
              <View>
                <Text style={{textAlign: 'center'}}>รางวัลเลขท้าย 2 ตัว</Text>
              </View>
            }>
            {dataLoading ? (
              <Text style={{textAlign: 'center'}}>
                <Spinner /> กำลังโหลด...
              </Text>
            ) : (
              <Text style={{textAlign: 'center', fontSize: 18}}>
                {lotData.twoend}
              </Text>
            )}
          </Card>
          <Card
            style={{marginTop: 2}}
            header={
              <View>
                <Text style={{textAlign: 'center'}}>รางวัลที่ 2</Text>
              </View>
            }>
            {/* <Text style={{textAlign: 'center', fontSize: 18}}>
              {lotData.twoend}
            </Text> */}
            <Layout
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginLeft: 10,
                marginRight: 10,
              }}>
              <Card style={{flexBasis: '20%'}}>
                {dataLoading ? (
                  <Text style={{textAlign: 'center'}}>
                    <Spinner />
                  </Text>
                ) : (
                  <Text style={{textAlign: 'center', fontSize: 18}}>
                    {fullLotData.length > 0 ? fullLotData[5][1] : ''}
                  </Text>
                )}
              </Card>
              <Card style={{flexBasis: '20%'}}>
                {dataLoading ? (
                  <Text style={{textAlign: 'center'}}>
                    <Spinner />
                  </Text>
                ) : (
                  <Text style={{textAlign: 'center', fontSize: 18}}>
                    {fullLotData.length > 0 ? fullLotData[5][2] : ''}
                  </Text>
                )}
              </Card>
              <Card style={{flexBasis: '20%'}}>
                {dataLoading ? (
                  <Text style={{textAlign: 'center'}}>
                    <Spinner />
                  </Text>
                ) : (
                  <Text style={{textAlign: 'center', fontSize: 18}}>
                    {fullLotData.length > 0 ? fullLotData[5][3] : ''}
                  </Text>
                )}
              </Card>
              <Card style={{flexBasis: '20%'}}>
                {dataLoading ? (
                  <Text style={{textAlign: 'center'}}>
                    <Spinner />
                  </Text>
                ) : (
                  <Text style={{textAlign: 'center', fontSize: 18}}>
                    {fullLotData.length > 0 ? fullLotData[5][4] : ''}
                  </Text>
                )}
              </Card>
              <Card style={{flexBasis: '20%'}}>
                {dataLoading ? (
                  <Text style={{textAlign: 'center'}}>
                    <Spinner />
                  </Text>
                ) : (
                  <Text style={{textAlign: 'center', fontSize: 18}}>
                    {fullLotData.length > 0 ? fullLotData[5][5] : ''}
                  </Text>
                )}
              </Card>
            </Layout>
          </Card>
          <Card
            style={{marginTop: 2}}
            header={
              <View>
                <Text style={{textAlign: 'center'}}>รางวัลที่ 3</Text>
              </View>
            }>
            <Layout
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginLeft: 10,
                marginRight: 10,
                flexWrap: 'wrap',
              }}>
              {fullLotData.length > 0 ? (
                fullLotData[6].map((item, index) =>
                  index != 0 ? (
                    <Card style={{flexBasis: '20%'}}>
                      {dataLoading ? (
                        <Text style={{textAlign: 'center'}}>
                          <Spinner />
                        </Text>
                      ) : (
                        <Text style={{textAlign: 'center', fontSize: 18}}>
                          {fullLotData.length > 0 ? item : ''}
                        </Text>
                      )}
                    </Card>
                  ) : (
                    <></>
                  ),
                )
              ) : (
                <></>
              )}
            </Layout>
          </Card>
          <Card
            style={{marginTop: 2}}
            header={
              <View>
                <Text style={{textAlign: 'center'}}>รางวัลที่ 4</Text>
              </View>
            }>
            <Layout
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginLeft: 10,
                marginRight: 10,
                flexWrap: 'wrap',
              }}>
              {fullLotData.length > 0 ? (
                fullLotData[7].map((item, index) =>
                  index != 0 ? (
                    <Card style={{flexBasis: '20%'}}>
                      {dataLoading ? (
                        <Text style={{textAlign: 'center'}}>
                          <Spinner />
                        </Text>
                      ) : (
                        <Text style={{textAlign: 'center', fontSize: 18}}>
                          {fullLotData.length > 0 ? item : ''}
                        </Text>
                      )}
                    </Card>
                  ) : (
                    <></>
                  ),
                )
              ) : (
                <></>
              )}
            </Layout>
          </Card>
          <Card
            style={{marginTop: 2}}
            header={
              <View>
                <Text style={{textAlign: 'center'}}>รางวัลที่ 5</Text>
              </View>
            }>
            <Layout
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginLeft: 10,
                marginRight: 10,
                flexWrap: 'wrap',
              }}>
              {fullLotData.length > 0 ? (
                fullLotData[8].map((item, index) =>
                  index != 0 ? (
                    <Card style={{flexBasis: '20%'}}>
                      {dataLoading ? (
                        <Text style={{textAlign: 'center'}}>
                          <Spinner />
                        </Text>
                      ) : (
                        <Text style={{textAlign: 'center', fontSize: 18}}>
                          {fullLotData.length > 0 ? item : ''}
                        </Text>
                      )}
                    </Card>
                  ) : (
                    <></>
                  ),
                )
              ) : (
                <></>
              )}
            </Layout>
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
                  // style={{display: 'none'}}
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
            <Spinner /> กำลังโหลด...
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

export default LotScreen;
