import React from 'react';
import {View, Text, SafeAreaView, StyleSheet, Dimensions, FlatList, Image} from 'react-native';
import Header from '../components/Header';
import colours from '../globals/colours';
import showIcon from '../globals/icons';
import AuthButton from '../components/AuthButton';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import { getFontontSize } from '../globals/functions';


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const NotificationScreen = ({navigation}) => {

  const [notiData, setNotiData] = React.useState(null);

  const _getNotifications = async() => {
    const axiosInstance = axios.create({
      baseURL: 'https://onesignal.com/api/v1/',
      headers: { 'Authorization': 'Basic YTZjZDU0MDgtZjU0Zi00MWQ1LWEyMTktYWEyMDQ5MDY1ZTRk' }
    });
    try {
      let result = await axiosInstance.get(`notifications?app_id=266dbe6c-b4a8-458c-ba84-28f64cac2796&limit=10&offset=0&kind=0`, {
        timeout: 15000,
        timeoutErrorMessage: 'Server is not responding',
      });
      setNotiData(result.data.notifications)
    } catch (error) {
    }
  }
  React.useEffect(() => {
    _getNotifications();
  }, []);

    return (
      <SafeAreaView style={styles.mainContainer}>
        <Header
          backEnable
          navigation={navigation}
          HeaderText={'Notifications'}
          WishList
          Cart
        />
        {
          notiData && notiData.length>0 ?
            <FlatList 
            showsVerticalScrollIndicator={false}
              contentContainerStyle={{width: windowWidth*(90/100), alignItems:'center'}}
              data={notiData}
              renderItem={({ item }, i) => (
                <View style={styles.datacontainer}>
                  <Image
                    source={require('../assets/images/Noti.png')}
                    style={{
                      height: windowWidth * (15 / 100),
                      width: windowWidth * (15 / 100),
                      marginHorizontal: windowWidth*(3/100),
                      resizeMode: 'contain',
                    }}
                  />
                  <View style={{
                    width: windowWidth*(65/100),
                  }}>
                    <Text style={styles.fontStyle3} numberOfLines={2}>{item.headings.en}</Text>
                    <Text style={styles.fontStyle2} numberOfLines={6}>{item.contents.en}</Text>
                  </View>
                </View>
                )}
              keyExtractor={(item, i) => i.toString()}
            />
          :

          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colours.white,
              height: windowHeight*(80/100)
            }}>
            <View style={{height: windowHeight*(30/100)}}>{showIcon('msg_tick', colours.kapraMain, 120)}</View>
            <Text style={styles.fontStyle3}>Message /Notification Here</Text>
            <Text style={styles.fontStyle4}>Message Details</Text>
            <AuthButton
              BackgroundColor={colours.kapraMain}
              OnPress={() => navigation.navigate('Home')}
              ButtonText={'Continue Shopping'}
              ButtonWidth={90}
            />
          </View>
        }
      </SafeAreaView>
    );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colours.kapraLow,
    alignItems: 'center',
  },
  datacontainer: {
    // height:windowHeight*(10/100),
    width: windowWidth*(90/100),
    flexDirection:'row',
    alignItems:'center',
    backgroundColor: colours.lowWhite,
    borderRadius:10,
    marginTop: windowHeight*(2/100)
  },
  fontStyle2: {
    fontFamily: 'Proxima Nova Alt Regular',
    fontSize: getFontontSize(14),
    color: colours.primaryGrey,
  },
  fontStyle3: {
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(20),
    color: colours.kapraMain,
  },
  fontStyle4: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(14),
    color: colours.kapraMain,
    textAlign: 'center',
  },
});
