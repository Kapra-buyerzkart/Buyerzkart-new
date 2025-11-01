import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import colours from '../globals/colours';
import { AppContext } from '../Context/appContext';
import AuthButton from './AuthButton';
import LinearGradient from 'react-native-linear-gradient';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function ModalAlert({
    updateModalVisible
}) {
  const { cartData } = React.useContext(AppContext);
  const { wishCount } = React.useContext(AppContext);
  const [ modalVisible, setModalVisible ] = React.useState(updateModalVisible);
  return (
    <View>
        <Modal
        animationType="slide"
        visible={modalVisible}
        transparent={true}
        >
            <View style={{width:windowWidth, height: windowHeight, backgroundColor: 'rgba(58, 0, 109,0.3)'}}>
                <View style={styles.updateModalView}>
                <Image
                    source={require('../assets/logo/logo.png')}
                    style={{
                        height: windowWidth * (20 / 100),
                        width: windowWidth * (80 / 100),
                        resizeMode: 'contain',
                    }}
                />
                <Text style={styles.headerText}>New version</Text>
                <View style={{flexDirection:'row', width:windowWidth*(90/100), justifyContent: 'space-around'}}>
                    {
                        appUpdateData&&appUpdateData.isCompulsory == false&&(
                        <AuthButton
                            BackgroundColor={colours.primaryRed}
                            OnPress={() => { setModalVisible(false) }}
                            ButtonText={'Cancel'}
                            ButtonWidth={40}
                        />
                        )
                    }
                    <AuthButton
                        BackgroundColor={colours.kapraMain}
                        OnPress={() => { setModalVisible(false) }}
                        ButtonText={'Update'}
                        ButtonWidth={40}
                    />
                </View>
                </View> 
            </View>
        </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
    updateModalView: {
        height: windowHeight * (30 / 100),
        marginTop: windowHeight * (70 / 100),
        paddingTop: windowHeight * (1 / 100),
        paddingBottom: windowHeight * (2 / 100),
        backgroundColor: colours.primaryWhite,
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40,
        elevation: 10,
        alignItems: "center",
        justifyContent:'space-between'
    },
});
