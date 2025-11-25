import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import {
  registerUser,
  loginUser,
  verifyOTP,
  updateProfile,
  mergeOnLogin,
  getCartList,
  getWishList,
  getLanguageList,
  verifyRefOTP
} from '../api';
import {
  GroGetCartList,
  getGroWishList,
  GroVerifyOTP,
  GroMergeOnLogin,
  groLoginUser,
  GroUpdateProfile,
  GroVerifyRefOTP
} from '../grocery/api'
import OneSignal from 'react-native-onesignal';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  //   const [auth, setAuth] = useState(false);
  const [dummy, setDummy] = React.useState(false);

  const [profile, setProfile] = useState({});
  const [wishCount, setWishCount] = useState(0);
  const [Language, setLanguage] = useState({});
  const [cartData, setCartData] = useState([]);
  const [wishListData, setWishListData] = useState([]);
  const [GroCartData, setGroCartData] = useState([]);
  const [GroCartList, setGroCartList] = useState([]);
  const [GroWishListData, setGroWishListData] = useState([]);
  const [GroWishCount, setGroWishCount] = useState(0);

  const loadProfile = async () => {
    let prof = await AsyncStorage.getItem('profile');
    if (!prof) {
      let obj = {
        guestId: Math.floor(Math.random() * 9000000000) + 1000000000,
        pincode: 661,
        pinAddress: 'Vennala',
      };
      await AsyncStorage.setItem('profile', JSON.stringify(obj));
      setProfile(obj);
    } else {
      setProfile(JSON.parse(prof));
    }
    // await updateLanguage();
    await loadCart();
    await loadWishList();
    await updateWishCount();
    await GroUpdateCart();
    await GroUpdateWishList();

  };

  const GroLoadCart = async () => {
    let GroLoacalCart = await AsyncStorage.getItem('GroLoacalCart');
    if (!GroLoacalCart) {
      setGroCartData([]);
    }
    else {
      setGroCartData(JSON.parse(GroLoacalCart));
    }
  }

  const GroUpdateCart = async (ProductID) => {
    let res = await GroGetCartList(0,'');
    if (res?.cartList?.length > 0) {
      let a = {};
      res.cartList.map((item, i) => {
        let key1 = item.productId;
        let qty = item.qty;
        a[key1] = qty;
      });
      await AsyncStorage.setItem('GroLoacalCart', JSON.stringify(a));
      setGroCartList(res?.cartList)
      setGroCartList(res?.cartList)
    } else {
      await AsyncStorage.removeItem('GroLoacalCart')
      setGroCartList([])
    }
    await GroLoadCart()
  };

  const loadCart = async () => {
    let localCart = await AsyncStorage.getItem('loacalCart');
    if (!localCart) {
      setCartData([]);
    }
    else {
      setCartData(JSON.parse(localCart));
    }
  }

  const updateCart = async (ProductID) => {
    let res = await getCartList();
    if (res.cartList.length > 0) {
      let a = {};
      res.cartList.map((item, i) => {
        let key1 = "p" + item.productId;
        let qty = item.qty;
        a[key1] = qty;
      });
      await AsyncStorage.setItem('loacalCart', JSON.stringify(a));
    } else {
      await AsyncStorage.removeItem('loacalCart')
    }
  };

  const loadWishList = async () => {
    let loacalWishList = await AsyncStorage.getItem('loacalWishList');
    if (!loacalWishList) {
      setWishListData([]);
    }
    else {
      setWishListData(JSON.parse(loacalWishList));
    }
  }

  const updateWishList = async () => {
    let res = await getWishList();
    if (res.length > 0) {
      let a = {};
      res.map((item, i) => {
        let key1 = "p" + item.productId;
        let value = true;
        a[key1] = value;
      });
      await AsyncStorage.setItem('loacalWishList', JSON.stringify(a));
    } else {
      await AsyncStorage.removeItem('loacalWishList')
    }
  };

  const GrowLoadWishList = async () => {
    let loacalWishList = await AsyncStorage.getItem('GroLoacalWishList');
    if (!loacalWishList) {
      setGroWishListData([]);
    }
    else {
      setGroWishListData(JSON.parse(loacalWishList));
    }
    await UpdateGroWishCount();
  }

  const GroUpdateWishList = async () => {
    let res = await getGroWishList();
    if (res.length > 0) {
      let a = {};
      res.map((item, i) => {
        let key1 = "p" + item.productId;
        let value = true;
        a[key1] = value;
      });
      await AsyncStorage.setItem('GroLoacalWishList', JSON.stringify(a));
    } else {
      await AsyncStorage.removeItem('GroLoacalWishList')
    }
    await GrowLoadWishList();
  };

  const editProfile = async (email, phone, name) => {
    let prof = await AsyncStorage.getItem('profile');
    let res = await updateProfile(email, phone, name);
    profile.custName = name;
    profile.emailId = email;
    profile.phoneNo = phone;
    setProfile(profile);
    await AsyncStorage.setItem('profile', JSON.stringify(profile));
  };

  const GroEditProfile = async (email, phone, name) => {
    let prof = await AsyncStorage.getItem('profile');
    let res = await GroUpdateProfile(email, phone, name);
    profile.custName = name;
    profile.emailId = email;
    profile.phoneNo = phone;
    setProfile(profile);
    setDummy(!dummy)
    await AsyncStorage.setItem('profile', JSON.stringify(profile));
  };

  const editPincode = async (item) => {
    
    let prof = await AsyncStorage.getItem('profile');
    // console.log("1111")
    profile.pincode = item?.pincodeId;
    if (item?.area !== null) {
      profile.pinAddress = item?.area;
      profile.pincode = item?.pincodeId
    }
    await AsyncStorage.setItem('profile', JSON.stringify(profile));
    // console.log("2222")
    setProfile(profile);
    setDummy(!dummy)
  };

  const register = async (OTP, urlkey, details, Ref) => {
    let res = await verifyOTP(OTP, urlkey,Ref);
    let prof = JSON.parse(await AsyncStorage.getItem('profile'));
    let obj = {
      ...prof,
      ...details,
      ...res,
    };
    await AsyncStorage.setItem('profile', JSON.stringify(obj));
    setProfile(obj);
    await mergeOnLogin();
    const OnesignalID = obj.custId;
    OneSignal.setExternalUserId(JSON.stringify(OnesignalID));
    return 'Account created successfully';
  };

  const GroRegister = async (OTP, urlkey, details, Ref) => {
    let res = await GroVerifyOTP(OTP, urlkey,Ref);
    let prof = JSON.parse(await AsyncStorage.getItem('profile'));
    let obj = {
      ...prof,
      ...details,
      ...res,
    };
    await AsyncStorage.setItem('profile', JSON.stringify(obj));
    setProfile(obj);
    await GroMergeOnLogin();
    const OnesignalID = obj.bkCustId;
    OneSignal.setExternalUserId(JSON.stringify(OnesignalID));
    return 'Account created successfully';
  };

  const refRegister = async (OTP, urlkey, details, Ref) => {
    let res = await verifyRefOTP(OTP, urlkey,Ref);
    let prof = JSON.parse(await AsyncStorage.getItem('profile'));
    let obj = {
      ...prof,
      ...details,
      ...res,
    };
    await AsyncStorage.setItem('profile', JSON.stringify(obj));
    setProfile(obj);
    await mergeOnLogin();
    const OnesignalID = obj.custId;
    OneSignal.setExternalUserId(JSON.stringify(OnesignalID));
    return 'Account created successfully';
  };

  const GroRefRegister = async (OTP, urlkey, details, Ref) => {
    await GroVerifyRefOTP(OTP, urlkey,Ref);
    let prof = JSON.parse(await AsyncStorage.getItem('profile'));
    let obj = {
      ...prof,
      ...details,
    };
    await AsyncStorage.setItem('profile', JSON.stringify(obj));
    setProfile(obj);
    await mergeOnLogin();
    const OnesignalID = obj.bkCustId;
    OneSignal.setExternalUserId(JSON.stringify(OnesignalID));
    return 'Account created successfully';
  };

  const login = async (payload) => {
    loadProfile();
    let user = await loginUser(payload);
    let prof = JSON.parse(await AsyncStorage.getItem('profile'));
    let obj = {
      ...prof,
      ...user,
    };
    await AsyncStorage.setItem('profile', JSON.stringify(obj));
    await mergeOnLogin();
    setProfile(obj);
    await updateWishCount();
    const OnesignalID = user.custId;
    OneSignal.setExternalUserId(JSON.stringify(OnesignalID));
    return 'Logged in successfully';
  };

  const GroLogin = async (payload) => {
    loadProfile();
    let user = await groLoginUser(payload);
    // console.log("user", user)
    let prof = JSON.parse(await AsyncStorage.getItem('profile'));
    let obj = {
      ...prof,
      ...user,
    };
    await AsyncStorage.setItem('profile', JSON.stringify(obj));
    await GroMergeOnLogin();
    setProfile(obj);
    await loadProfile();
    const OnesignalID = user.bkCustId;
    OneSignal.setExternalUserId(JSON.stringify(OnesignalID));
    return 'Logged in successfully';
  };

  const logout = async () => {
    let prof = JSON.parse(await AsyncStorage.getItem('profile'));
    let obj = {
      guestId: prof.guestId,
      pincode: prof.pincode,
      pinAddress: prof.pinAddress,
    };
    await AsyncStorage.clear();
    await AsyncStorage.setItem('profile', JSON.stringify(obj));
    await AsyncStorage.setItem('isOpenedBefore', 'true');
    setProfile(obj);
    await updateWishCount();
    await updateCart();
    await loadCart();
    await GroUpdateWishList();
    await GroUpdateCart();
    await GroLoadCart();
    return 'Logged out successfully';
  };

  const updateWishCount = async () => {
    try {
      let res = await getWishList();
      setWishCount(res.length);
    } catch (err) {;
      Toast.show(err);
    }
  };

  const UpdateGroWishCount = async () => {
    try {
      let res = await getGroWishList();
      setGroWishCount(res.length);
    } catch (err) {;
      Toast.show(err);
    }
  };
  
  const updateLanguage = async () => {
    let langCode = await AsyncStorage.getItem('LangCode');
    if (langCode) {
      try {
        let Lang = await getLanguageList(langCode);
        setLanguage(Lang);
      } catch (err) {
        Toast.show(err);
      }
    }
    else {
      try {
        let Lang = await getLanguageList('en');
        setLanguage(Lang);
      } catch (err) {
        Toast.show(err);
      }
    }
  };

  const value = {
    // auth,
    register,
    login,
    profile,
    loadProfile,
    logout,
    editProfile,
    editPincode,
    wishCount,
    updateWishCount,
    updateLanguage,
    Language,
    loadCart,
    refRegister,
    updateCart,
    cartData,
    loadWishList,
    updateWishList,
    wishListData,
    GroCartList,


    
    GroUpdateWishList,
    GroUpdateCart,
    GroCartData,
    UpdateGroWishCount,
    GroWishCount,
    GroWishListData,
    GroRegister,
    GroLogin,
    GroEditProfile,
    GroRefRegister,

  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
