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
import { getFontontSize } from '../globals/functions';

const windowWidth = Dimensions.get('window').width;
export default function PriceCard({
    UnitPrice,
    SpecialPrice,
    FontSize,
    Color,
    UPColor,
    SmallFontSize,
    FromCart,
}) {
    return (
        <View style={[styles.mainContainer, { flexDirection: FromCart ? 'column' : 'row', alignItems: FromCart ? 'flex-start' : 'center' }]}>
            {SpecialPrice ? (
                <>
                    <Text style={[styles.fontStyle2, { fontSize: FontSize ? FontSize : getFontontSize(16), color: Color ? Color : colours.primaryBlack }]}>₹ {SpecialPrice.toFixed(2)}  </Text>
                    <Text style={[styles.fontStyle3, { fontSize: SmallFontSize ? SmallFontSize : FontSize ? FontSize - 4 : getFontontSize(12),  color: UPColor? UPColor: colours.primaryGrey, }]}>₹ {UnitPrice.toFixed(2)}</Text>
                </>
            ) : (
                <Text style={[styles.fontStyle2, { fontSize: FontSize ? FontSize : getFontontSize(16), color: Color ? Color : colours.primaryBlack }]}>₹ {UnitPrice.toFixed(2)}</Text>
            )}
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
        fontFamily: 'Proxima Nova Alt Regular',
        fontSize: 16,
    },
    fontStyle3: {
        fontFamily: 'Proxima Nova Alt Regular',
        fontSize: 10,
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
    },

});