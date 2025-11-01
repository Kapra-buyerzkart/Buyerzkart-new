import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';
import colours from '../../globals/colours';
import { getFontontSize } from '../globals/GroFunctions';
import { getPolicies } from '../api';

const windowWidth = Dimensions.get('window').width;
export default function OrderCountDown({
    EstimatedTime,
    Status
}) {

    const [ delayMessage, setDelayMessage ] = React.useState(null);
    const [ reachedMessage, setReachedMessage ] = React.useState(null);

    const getTimerPolicies = async() => {
        try{
            let res = await getPolicies();
            setDelayMessage(res.filter((obj)=>obj.stName == "orderDelayMessage"))
            setReachedMessage(res.filter((obj)=>obj.stName == "deliveryAgentReachedMsg"))
        }catch(err){

        }
    }

    React.useEffect(() => {
        getTimerPolicies()
    }, []);
    return (
        <View style={styles.timerContainer}>
            {
                EstimatedTime > 0 ? (
                    <View >
                        <View style={styles.timeCon}>
                            <Text style={styles.fontStyle1}>{EstimatedTime}</Text>
                            <Text  style={styles.fontStyle2}>Minutes</Text>
                        </View>
                    </View>
                )
                :
                    Status=== "Order Dispatched" ?
                    <Text style={styles.fontStyle2} numberOfLines={3}>{reachedMessage&&reachedMessage.length>0?reachedMessage[0].stValue:"--"} </Text>
                    :
                    <Text style={styles.fontStyle2} numberOfLines={3}>{delayMessage&&delayMessage.length>0?delayMessage[0].stValue:"--"} </Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        padding: 2
    },
    timeCon: {
        width: windowWidth*(25/100),
        height: windowWidth*(25/100),
        alignItems:'center',
        justifyContent:'center',
    },
    fontStyle1: {
        fontFamily: 'Montserrat-Bold',
        fontSize: getFontontSize(25),
        width: windowWidth*(22/100),
        marginVertical: '5%',
        textAlign:'center',
        color: colours.grey,
    },
    fontStyle2: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: getFontontSize(10),
        width: windowWidth*(22/100),
        marginVertical: '5%',
        textAlign:'center',
        color: colours.grey,
    },
    timerContainer: {
        width: windowWidth*(25/100),
        height: windowWidth*(25/100),
        borderRadius: windowWidth*(25/100),
        alignItems: 'center',
        justifyContent: 'center'
    },

});