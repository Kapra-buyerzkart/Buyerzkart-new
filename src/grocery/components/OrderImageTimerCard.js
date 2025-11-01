import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
    OnPress,
} from 'react-native';
import colours from '../../globals/colours';
import LottieView from 'lottie-react-native';
import { getFontontSize } from '../globals/GroFunctions';
import OrderCountDown from './OrderCountDown';
import moment from 'moment';

const windowWidth = Dimensions.get('window').width;
export default function OrderImageTimerCard({
    Status,
    DeliveryMode,
    ETA,
    SlotDate,
    SlotFromTime,
    SlotToTime,
}) {

    return (
        <View>
            {
                Status === "Order Placed" ?
                    <View style={styles.timerMainCon}>
                        <Image
                            source={require('../../assets/images/OS1.png')}
                            style={styles.timerConImgBG}
                        />
                        <View>
                          <LottieView 
                            source={require('../../assets/Lottie/carRoad.json')} 
                            style={styles.timerConLottie} 
                            autoPlay
                            loop
                          />
                          <View style={styles.timerConCountDown}>
                            {
                              DeliveryMode == "Express"?
                                    ETA?
                                    <OrderCountDown EstimatedTime={ETA&&ETA.eta}/>
                                    :
                                    null
                                :
                                <View>
                                  <Text style={[styles.fontStyle3,{fontSize: getFontontSize(12),textAlign:'center'}]}>{moment(SlotDate).utcOffset('+05:30').format('MMM DD, YYYY')}</Text>
                                  <Text style={[styles.fontStyle3,{fontSize: getFontontSize(11),textAlign:'center'}]}>{moment(SlotFromTime, 'HH:mm:ss.SSSSSSS').format('h:mm A')} - {moment(SlotToTime, 'HH:mm:ss.SSSSSSS').format('h:mm A')}</Text>
                                </View>
                            }
                          </View>
                        </View>
                    </View>
                    :
                    Status === "Order Accepted" ?
                        <View style={styles.timerMainCon}>
                            <Image
                                source={require('../../assets/images/OS2.png')}
                                style={styles.timerConImgBG}
                            />
                            <View>
                              <LottieView 
                                source={require('../../assets/Lottie/carRoad.json')} 
                                style={styles.timerConLottie} 
                                autoPlay
                                loop
                              />
                              <View style={styles.timerConCountDown}>
                                {
                                  DeliveryMode == "Express"?
                                        ETA?
                                        <OrderCountDown EstimatedTime={ETA&&ETA.eta}/>
                                        :
                                        null
                                    :
                                    <View>
                                      <Text style={[styles.fontStyle3,{fontSize: getFontontSize(12),textAlign:'center'}]}>{moment(SlotDate).utcOffset('+05:30').format('MMM DD, YYYY')}</Text>
                                      <Text style={[styles.fontStyle3,{fontSize: getFontontSize(11),textAlign:'center'}]}>{moment(SlotFromTime, 'HH:mm:ss.SSSSSSS').format('h:mm A')} - {moment(SlotToTime, 'HH:mm:ss.SSSSSSS').format('h:mm A')}</Text>
                                    </View>
                                }
                              </View>
                            </View>
                        </View>
                        :
                        Status === "Order Packed" ?
                            <View style={styles.timerMainCon}>
                                <Image
                                    source={require('../../assets/images/OS3.png')}
                                    style={styles.timerConImgBG}
                                />
                                <View>
                                  <LottieView 
                                    source={require('../../assets/Lottie/carRoad.json')} 
                                    style={styles.timerConLottie} 
                                    autoPlay
                                    loop
                                  />
                                  <View style={styles.timerConCountDown}>
                                    {
                                      DeliveryMode == "Express"?
                                            ETA?
                                            <OrderCountDown EstimatedTime={ETA&&ETA.eta}/>
                                            :
                                            null
                                        :
                                        <View>
                                          <Text style={[styles.fontStyle3,{fontSize: getFontontSize(12),textAlign:'center'}]}>{moment(SlotDate).utcOffset('+05:30').format('MMM DD, YYYY')}</Text>
                                          <Text style={[styles.fontStyle3,{fontSize: getFontontSize(11),textAlign:'center'}]}>{moment(SlotFromTime, 'HH:mm:ss.SSSSSSS').format('h:mm A')} - {moment(SlotToTime, 'HH:mm:ss.SSSSSSS').format('h:mm A')}</Text>
                                        </View>
                                    }
                                  </View>
                                </View>
                            </View>
                            :
                            Status === "Order Dispatched" ?
                                <View style={styles.timerMainCon}>
                                    <Image
                                        source={require('../../assets/images/OS4.png')}
                                        style={styles.timerConImgBG}
                                    />
                                    <View>
                                      <LottieView 
                                        source={require('../../assets/Lottie/carRoad.json')} 
                                        style={styles.timerConLottie} 
                                        autoPlay
                                        loop
                                      />
                                      <View style={styles.timerConCountDown}>
                                        {
                                          DeliveryMode == "Express"?
                                                ETA?
                                                <OrderCountDown 
                                                    EstimatedTime={ETA&&ETA.eta}
                                                    Status={Status}
                                                />
                                                :
                                                null
                                            :
                                            <View>
                                              <Text style={[styles.fontStyle3,{fontSize: getFontontSize(12),textAlign:'center'}]}>{moment(SlotDate).utcOffset('+05:30').format('MMM DD, YYYY')}</Text>
                                              <Text style={[styles.fontStyle3,{fontSize: getFontontSize(11),textAlign:'center'}]}>{moment(SlotFromTime, 'HH:mm:ss.SSSSSSS').format('h:mm A')} - {moment(SlotToTime, 'HH:mm:ss.SSSSSSS').format('h:mm A')}</Text>
                                            </View>
                                        }
                                      </View>
                                    </View>
                                </View>
                                :
                                Status === "Order Delivered" ?
                                    <View style={styles.timerMainCon}>
                                        <Image
                                            source={require('../../assets/images/OS5.png')}
                                            style={styles.timerConImgBG}
                                        />
                                        <View>
                                          <LottieView 
                                            source={require('../../assets/Lottie/carRoad.json')} 
                                            style={styles.timerConLottie} 
                                            autoPlay
                                            loop
                                          />
                                          <View style={styles.timerConCountDown}>
                                            <Text style={[styles.fontStyle3,{fontSize: getFontontSize(12),textAlign:'center'}]}>Delivered</Text>
                                          </View>
                                        </View>
                                    </View>
                                    :
                                    null
            }

        
        </View>
    );
}

const styles = StyleSheet.create({
    timerMainCon: {
      height: windowWidth*(90/100),
      width: windowWidth,
      alignItems:'center',
    },
    timerConImgBG: {
      height: windowWidth*(70/100),
      width: windowWidth*(70/100),
      resizeMode: 'contain',
    },
    timerConLottie: {
      height: windowWidth * (50 / 100),
      width: windowWidth * (50 / 100),
      top: Platform.OS == 'ios'? - 35 : -45,
    },
    timerConCountDown: {
      position:'absolute',
      height: windowWidth * (25 / 100),
      width: windowWidth * (25 / 100),
      alignItems:'center',
      justifyContent:'center',
      top: Platform.OS == 'ios'? -56 : -45,
      left: Platform.OS == 'ios'? windowWidth*(12.5/100) :  windowWidth*(12.5/100),
    },


    fontStyle3: {
        fontFamily: 'Lexend-SemiBold',
        fontSize: getFontontSize(13),
        color: colours.primaryBlack,
      },
});