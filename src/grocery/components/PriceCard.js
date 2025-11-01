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
import { getFontontSize } from '../globals/GroFunctions';

const windowWidth = Dimensions.get('window').width;
export default function PriceCardCard({
    UnitPrice,
    SpecialPrice,
    FontSize,
    Color,
    UPColor,
    SmallFontSize,
    FromCart,
    MRP
}) {
    return (
        <View style={[styles.mainContainer, { flexDirection: FromCart ? 'column' : 'row', alignItems: FromCart ? 'flex-start' : 'center' }]}>
            {SpecialPrice && SpecialPrice !== UnitPrice && SpecialPrice !==0? (
                <>
                    <Text style={[styles.fontStyle2, { fontSize: FontSize ? FontSize : getFontontSize(16), color: Color ? Color : colours.primaryBlack }]}>₹ {parseFloat(SpecialPrice).toFixed(2)}  </Text>
                    <Text style={[styles.fontStyle3, { fontSize: SmallFontSize ? SmallFontSize : FontSize ? FontSize - 4 : getFontontSize(12),  color: UPColor? UPColor: colours.primaryGrey, }]}>{MRP? "MRP " : '' }₹ {parseFloat(UnitPrice).toFixed(2)}</Text>
                </>
            ) : (
                <Text style={[styles.fontStyle2, { fontSize: FontSize ? FontSize : getFontontSize(16), color: Color ? Color : colours.primaryBlack }]}>₹ {parseFloat(UnitPrice).toFixed(2)}</Text>
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
        fontFamily: 'Lexend-Medium',
        fontSize: 16,
    },
    fontStyle3: {
        fontFamily: 'Lexend-Regular',
        fontSize: 10,
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
    },

});