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
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import { useFocusEffect } from '@react-navigation/native';

import { getFontontSize } from '../globals/GroFunctions';
import AuthButton from '../components/AuthButton';
import colours from '../../globals/colours';
import { getOrderList, postReOrder, getOrderListWithPagination } from '../api';
import { LoaderContext } from '../../Context/loaderContext';
import { AppContext } from '../../Context/appContext';
import showIcon from '../../globals/icons';
import OrderlistCard from '../components/OrderlistCard';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function GroMyOrdersScreen({ navigation, route }) {
  
  const [data, setData] = React.useState(null);
  const [totalCount, setTotalCount] = React.useState(0);
  const [pageCount, setPageCount] = React.useState(0);

  const { showLoader } = React.useContext(LoaderContext);
  const { GroUpdateCart } = React.useContext(AppContext);

  const _fetchOrderList = async () => {
    try {
      showLoader(true);
      // let res = await getOrderList();
      let res = await getOrderListWithPagination(1,5);
      setData(res);
      setPageCount(pageCount+1)
      setTotalCount(res[0]?.TotalOrders)
      showLoader(false);
    } catch (err) {
      showLoader(false);
      Toast.show(err);
    }
  };

  const _fetchLoadMoreData = async (loader = true) => {
    let res = await getOrderListWithPagination(pageCount,5);
    setData([...data, ...res]);
    setPageCount(pageCount + 1);
  };
  

  useFocusEffect(
    React.useCallback(() => {
      _fetchOrderList();
    }, []),
  );

  const ReOrder = async(orderId) => {
    Alert.alert(
      'REORDER',
      'Are you sure want to reorder this?',
      [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: async () => {
            try{
              showLoader(true);
              let res = await postReOrder(orderId);
              showLoader(false);
              await GroUpdateCart();
              Toast.show('Items aaded to cart, Please place order.');
              navigation.dispatch(
                  CommonActions.reset({
                  index: 1,
                  routes: [
                      { name: 'GroHomeScreen' },
                      {
                          name: 'GroCartScreen',
                      },
                  ],
                  })
              )
        
            } catch(err){
              
            }
          },
        },
      ],
      { cancelable: false },
    )
  }

  const renderFooter = () => {
    return (
      // Footer View with Loader
      <View>
        <ActivityIndicator
          color={colours.kapraMain}
          style={{ margin: 15 }} 
        />
      </View>
    );
  };

  if (data === null) return null;
  return (
    <SafeAreaView style={styles.mainContainer}>

      {/* Header Con  */}
      <View style={styles.headerCon}>
        <TouchableOpacity style={styles.backButtonCon} onPress={()=>navigation.goBack()}>
          {showIcon('back2', colours.kapraBlack, windowWidth*(5/100))}
        </TouchableOpacity>
        <Text style={styles.headerText}>My Orders</Text>
      </View>

      <Text/>
      {/* Order List  */}
      <FlatList
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={_fetchOrderList} />
        }
        data={ data }
        renderItem={({ item }, i) => (
          <OrderlistCard 
            Data={item}
            Amount={item.orderAmount}
            OnPress={() =>
              navigation.navigate('GroSingleOrderScreen', {
                orderId: item.orderId,
                IsCanCancelOrder: item.IsCanCancelOrder
              })
            }
            ReOrder={()=>ReOrder(item.orderId)}
          />
        )}
        keyExtractor={(item) => item.orderId.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View
            style={styles.emptyCon}>
            <Image 
              source={require('../../assets/images/Order1.png')}
              style={styles.emptyImg}
            />
            <Text style={styles.fontStyle3}>Orders Empty</Text>
            <Text style={styles.fontStyle4}>Nothing to show</Text>
            <AuthButton
              FirstColor={colours.kapraOrange}
              SecondColor={colours.kapraOrangeDark}
              OnPress={() => navigation.navigate('GroSearchModalScreen')}
              ButtonText={'Browse More'}
              ButtonWidth={90}
            />
          </View>
        }
        onEndReached={
          data.length !== totalCount ? () => _fetchLoadMoreData() : null
        }
        onEndReachedThreshold={0.5}
        ListFooterComponent={totalCount !== data.length ? () => renderFooter() : null}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colours.kapraWhiteLow,
    alignItems: 'center',
  },
  headerCon: {
    width:windowWidth,
    height: windowHeight*(8/100),
    backgroundColor: colours.kapraWhite,
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
    paddingHorizontal: windowWidth*(5/100)
  },
  backButtonCon: {
    width: windowWidth*(10/100),
    height: windowWidth*(10/100),
    borderRadius: windowWidth*(10/100),
    alignItems:'center',
    justifyContent:'center',
  },


  emptyCon: {
    height: windowHeight*(80/100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImg: {
    width: windowWidth*(70/100),
    height: windowWidth*(70/100),
  },




  headerText: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(18),
    color: colours.kapraBlack,
  },
  fontStyle3: {
    fontFamily: 'Lexend-Medium',
    fontSize: getFontontSize(16),
    color: colours.kapraBlack,
    paddingTop: '5%',
  },
  fontStyle4: {
    fontFamily: 'Lexend-Regular',
    fontSize: getFontontSize(14),
    color: colours.kapraBlackLight,
    textAlign: 'center',
    paddingTop: '3%',
    paddingBottom: '3%',
  },
});
