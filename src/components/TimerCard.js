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
import colours from '../globals/colours';
import showIcon from '../globals/icons';
import { AppContext } from '../Context/appContext';
import moment from 'moment';
import CountDown from 'react-native-countdown-component';

const windowWidth = Dimensions.get('window').width;
export default function TimerCard({
    DealTo
}) {
    const { Language } = React.useContext(AppContext);
    const Lang = Language;
    const [totalDuration, setTotalDuration] = React.useState(0);
    const [noDays, setNoDays] = React.useState(0);
    const [Date, SetDate] = React.useState({});
    const timerData = () => {
        let date =
            moment()
                .utcOffset('+05:30')
                .format('YYYY-MM-DD hh:mm:ss');
        // let expirydate = '2020-11-14 20:28:45';
        let expirydate = moment(DealTo)
            .utcOffset('+05:30')
            .format();
        let showDate = moment(DealTo)
            .utcOffset('+05:30')
            .format('Do MMM');

        let diffr =
            moment
                .duration(moment(expirydate)
                    .diff(moment(date)));
        var hours = parseInt(diffr.asHours());
        var minutes = parseInt(diffr.minutes());
        var seconds = parseInt(diffr.seconds());
        var d = hours * 60 * 60 + minutes * 60 + seconds;
        SetDate(showDate);
        setNoDays(hours);
        setTotalDuration(d);
    }
    React.useMemo(() => {
        timerData();
    }, [totalDuration]);
    return (
        <View style={styles.timerContainer}>
            {
                totalDuration > 0 && (
                    <>
                        <Text style={styles.fontStyle2}>Ends </Text>
                        {
                            noDays > 24 ?
                                <Text style={[styles.fontStyle2, { fontSize: 14 }]}>{Date}</Text>
                                :

                                <CountDown
                                    until={totalDuration}
                                    //until={10000}
                                    size={10}
                                    //onFinish={() => alert('Finished')}
                                    digitStyle={{ width: 15, }}
                                    digitTxtStyle={{ color: colours.primaryRed }}
                                    timeToShow={['H', 'M', 'S']}
                                    separatorStyle={{ color: colours.primaryRed, width: 2 }}
                                    timeLabels={{ m: null, s: null }}
                                    showSeparator
                                />
                        }
                    </>
                )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        //marginTop: '6%',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 2
    },
    fontStyle2: {
        fontFamily: 'Proxima Nova Alt Bold',
        fontSize: 10,
        marginLeft: '5%',
        marginRight: '5%',
        color: colours.grey,
    },
    timerContainer: {
        height: windowWidth * (5 / 100),
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'flex-start',
        marginBottom: 5
    },

});