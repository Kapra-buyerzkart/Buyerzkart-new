import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  RefreshControl,
  View,
  FlatList,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert
} from 'react-native';

import Header from '../components/Header';
import OrdersCard from '../components/OrdersCard';
import { getImage, getFontontSize } from '../globals/functions';
import AuthButton from '../components/AuthButton';
import colours from '../globals/colours';
import { getOrderList, getSingleOrderStatus, CancelOrder } from '../api';
import { LoaderContext } from '../Context/loaderContext';
import showIcon from '../globals/icons';
import Toast from 'react-native-simple-toast';
import { useFocusEffect } from '@react-navigation/native';
import { AppContext } from '../Context/appContext';
import { Modal } from 'react-native';
import StepIndicator from 'react-native-step-indicator';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function MyOrdersScreen({ navigation, route }) {
  const { Language } = React.useContext(AppContext);
  const Lang = Language;
  const [data, setData] = React.useState(null);
  const [stepCount, setStepCount] = React.useState(0);
  const [statusData, setStatusData] = React.useState({});
  const [viewAll, setViewAll] = React.useState(
    route?.params?.viewAll ? true : false,
  );
  let showSideNav = route?.params?.showSideNav ? true : false;
  const { showLoader, loading } = React.useContext(LoaderContext);

  const _fetchOrderList = async () => {
    try {
      showLoader(true);
      let res = await getOrderList();
      setData(res);
      showLoader(false);
    } catch (err) {
      showLoader(false);
      Toast.show(err);
    }
  };

  React.useEffect(() => {
    _fetchOrderList();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      _fetchOrderList();
    }, []),
  );

  if (data === null) return null;
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header
        navigation={navigation}
        HeaderText={'My Orders'}
        backEnable
        WishList
        Cart
      />
      <FlatList
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={_fetchOrderList} />
        }
        data={viewAll ? data : data.slice(0, 4)}
        renderItem={({ item }, i) => (
          <OrdersCard
            fromOrder={true}
            OrderNo={item.orderNumber}
            Status={item.status}
            Product={item.Products}
            Date={item.orderDate}
            ProductCount={item.ProductCount}
            OrderAmount={item.orderAmount}
            ImageUri={getImage(item.ProductImgUrl)}
            IsCanCancelOrder={item.IsCanCancelOrder}
            orderId={item.orderId}
            OnPress={() =>
              navigation.navigate('SingleOrder', {
                orderId: item.orderId,
              })
            }
            CancelOrder={async () => {
              Alert.alert(
                "Order",
                "Are you sure want to Cancel this order?",
                [
                  {
                    text: 'Cancel',
                    onPress: () => null,
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: async () => {
                      await CancelOrder(item.orderId);
                      await _fetchOrderList();
                    },
                  },
                ],
                { cancelable: false },
              );
            }}
          //trackShippment={() => trackOrder(item.orderId)}
          />
        )}
        keyExtractor={(item) => item.orderId.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          width: windowWidth,
          alignItems: 'center',
          paddingBottom: '5%',
        }}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>{showIcon('bin1', colours.primaryRed, 100)}</Text>
            <Text style={styles.fontStyle3}>My Orders Empty</Text>
            <Text style={styles.fontStyle4}>Nothing to show</Text>
            <AuthButton
              BackgroundColor={colours.kapraMain}
              OnPress={() => navigation.navigate('SearchScreen')}
              ButtonText={'Browse More'}
              ButtonWidth={90}
            />
          </View>
        }
      />

      {data.length > 4
        ? !viewAll && (
          <View style={{ paddingTop: '8%' }}>
            <AuthButton
              BackgroundColor={colours.kapraMain}
              OnPress={() => setViewAll(true)}
              ButtonText={'View All Orders'}
              ButtonWidth={90}
            />
          </View>
        )
        : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  mainContainer: {
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
  },
  fontStyle3: {
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(16),
    color: colours.primaryBlack,
    paddingTop: '5%',
  },
  fontStyle4: {
    fontFamily: 'Proxima Nova Alt Light',
    fontSize: getFontontSize(14),
    color: colours.primaryBlack,
    textAlign: 'center',
    paddingTop: '3%',
    paddingBottom: '3%',
  },
});
