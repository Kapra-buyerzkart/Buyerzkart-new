import { get, get1, post, put, postRegister } from './networkUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';
import CONFIG from '../globals/config';

export const LanguageData = async () => {
  let lang = JSON.parse(await AsyncStorage.getItem('language'));
  return lang;

}

export const updateCheck = async (version, platform, type) => {
  //let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `AppUpdateCheck?versionCode=${version}&platform=${platform}&type=${type}`;
  return await get(URL);
};

//AUTH endpoints
export const registerUser = async (payload) => {
  const URL = `Customer/Register`;
  let register = await postRegister(URL, payload);
  return register;
};

export const deleteAccount = async (id) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  URL = `Customer/DeleteCustomer?id=${profile.bkCustId ? profile.bkCustId : null}`;
  return await post(URL);
};

export const loginUser = async (payload) => {
  const URL = `Account/Login`;
  let login = await post(URL, payload);
  return login;
};

export const changePassword = async (oldPassword, newPassword) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `customer/ChangePassword`;
  let changePassword = await post(URL, {
    custId: profile.bkCustId ? profile.bkCustId : null,
    oldPassword: oldPassword,
    newPassword: newPassword,
  });
  return changePassword;
};

export const forgotPassword = async (phone = '', email = '') => {
  const URL = `Customer/ForgotPassword?email=${email}&mobileNumber=${phone}`;
  let res = await get(URL);
  return res;
};

export const forgotPasswordVerify = async (OTP, UrlKey) => {
  const URL = `Customer/VerifyOTP?OTP=${OTP}&OtpUrlKey=${UrlKey}&isChangePass=1`;
  let res = await get(URL);
  return res;
};

export const resendOTP = async (UrlKey) => {
  const URL = `Customer/SendAgainOTP?OtpUrlKey=${UrlKey}`;
  let res = await get(URL);
  return res;
};

export const forgotPasswordReset = async (password, UrlKey) => {
  const URL = `Customer/ResetPassword?OtpUrlKey=${UrlKey}&password=${password}`;
  let res = await get(URL);
  return res;
};

export const verifyOTP = async (OTP, UrlKey, Ref) => {
  const URL = `Customer/VerifyOTP?OTP=${OTP}&OtpUrlKey=${UrlKey}&referrerId=${Ref}`;
  let verify = await get(URL);
  return verify;
};

export const verifyRefOTP = async (OTP, UrlKey, Ref) => {
  const URL = `Customer/RefVerifyOTP?otp=${OTP}&OtpUrlKey=${UrlKey}&referralCode=${Ref}`;
  let verify = await get(URL);
  return verify;
};

export const mergeOnLogin = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/MergeUserCart`;
  let searchResult = await post(URL, {
    custId: profile.bkCustId,
    guestId: profile.guestId,
  });
  return searchResult;
};

//Normal endpoints
export const getHomeData = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  // console.log('profile', profile)
  const URL = `Products/HomeProducts?custId=${profile.bkCustId ? profile.bkCustId : ''
    }&guestId=${profile.bkCustId ? '' : profile.guestId}&pincode=${profile.pincode
    }`;
  let HomeProducts = await get(URL);
  return HomeProducts;
};
export const offerZoneData = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `offerZone`;
  let offerZoneDetails = await get(URL);
  return offerZoneDetails;
};

export const getCategoryOffer = async (key) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `offerCatProduct?custId=${profile.bkCustId ? profile.bkCustId : ''}&guestId=${profile.bkCustId ? '' : profile.guestId}&catUrlKey=${key}`;
  let offerZoneDetails = await get(URL);
  return offerZoneDetails;
};

export const offerZoneDealData = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `offerDeals?custId=${profile.bkCustId ? profile.bkCustId : ''
    }&guestId=${profile.bkCustId ? '' : profile.guestId}`;
  let offerZoneDetails = await get(URL);
  return offerZoneDetails;
};

export const offerCategoryData = async (caturlKey) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `offerCatProduct?custId=${profile.bkCustId ? profile.bkCustId : ''
    }&guestId=${profile.bkCustId ? '' : profile.guestId}&catUrlKey=${caturlKey}`;
  let offerZoneDetails = await get(URL);
  return offerZoneDetails;
};

export const getSingleItemData = async (UrlKey) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `ProductDetails?urlKey=${UrlKey}&custId=${profile.bkCustId ? profile.bkCustId : ''
    }&guestId=${profile.bkCustId ? '' : profile.guestId}&pincode=${profile.pincode
    }`;
  let SingleItem = await get(URL);
  return SingleItem;
};

export const getRelatedProducts = async (UrlKey) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `GetRelatedProducts?urlKey=${UrlKey}&custId=${profile.bkCustId ? profile.bkCustId : ''}&guestId=${profile.bkCustId ? '' : profile.guestId}&pincode=${profile.pincode}`;
  let SingleItem = await get(URL);
  return SingleItem;
};

export const getSingleItemReviews = async (UrlKey) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Product/ProductReview?urlKey=${UrlKey}&CustId=${profile.bkCustId ? profile.bkCustId : ''
    }&guestId=${profile.bkCustId ? '' : profile.guestId}`;
  let ItemReviews = await get(URL);
  return ItemReviews;
};

export const getReferral = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `referralList?custId=${profile.bkCustId ? profile.bkCustId : ''}`;
  let ItemReviews = await get(URL);
  return ItemReviews;
};

export const postReferral = async (payload) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Customer/AddReferral`;
  let searchResult = await post(URL, payload);
  return searchResult;
};

export const writeReview = async (payload) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Product/ProductReviewSubmit`;
  let searchResult = await post(URL, {
    ...payload,
    cusId: profile.bkCustId,
  });
  return searchResult;
};

export const getCartList = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/CartList?cusId=${profile.bkCustId ? profile.bkCustId : ''
    }&guestId=${profile.bkCustId ? '' : profile.guestId}&pincode=${profile.pincode
    }`;
  return await get(URL);
};

export const getCartSummary = async (addID, delMode) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/CartSummary?cusId=${profile.bkCustId ? profile.bkCustId : ''}&guestId=${profile.bkCustId ? '' : profile.guestId}&pincode=${profile.pincode}`;
  let res = await get(URL);
  return res;
};

export const getOrderList = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/CustOrderList?cusId=${profile.bkCustId ? profile.bkCustId : ''
    }&guestId=${profile.bkCustId ? '' : profile.guestId}`;
  return await get(URL);
};

export const getSingleOrder = async (id) => {
  const URL = `Order/CustOrderItemList?orderId=${id}`;
  return await get(URL);
};

export const getSingleOrderStatus = async (id) => {
  const URL = `Order/TrackOrder?orderId=${id}`;
  return await get(URL);
};

export const ReturnRequest = async (oNumber, pID, Qty) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/ReturnRequest`;
  let searchResult = await post(URL, {
    custId: profile.bkCustId ? profile.bkCustId : '',
    qty: Qty,
    orderId: oNumber,
    productId: pID,
  });
  return searchResult;
};

export const CancelOrder = async (orderID) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/CancelOrderItem?orderId=${orderID}&custId=${profile.bkCustId ? profile.bkCustId : profile.guestId}`;
  return await get(URL);
};

export const removeFromCart = async (id) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/RemoveCartItem?cartItemId=${id}`;
  return await get(URL);
};

export const decreaseCartItemByURLKey = async (urlKey) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/CartItemSubQtyByUrlKey`;
  let cartResult = await post(URL, {
    custId: profile.bkCustId ? profile.bkCustId : null,
    guestId: profile.bkCustId ? null : profile.guestId,
    urlKey: urlKey,
  });
  return cartResult;
};

export const RemoveCartItemByUrlkey = async (key) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/RemoveCartItemByUrlkey`;
  let searchResult = await post(URL, {
    urlKey: key,
    guestId: profile.bkCustId ? '' : profile.guestId,
    custId: profile.bkCustId ? profile.bkCustId : '',
  });
  return searchResult;
};

export const removeAllFromCart = async (id) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/RemoveAllCartItem?cusId=${profile.bkCustId ? profile.bkCustId : ''
    }&guestId=${profile.bkCustId ? '' : profile.guestId}`;
  return await get(URL);
};

export const removeBuyNow = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `RemoveBuyNow?custId=${profile.bkCustId ? profile.bkCustId : ''
    }`;
  return await get(URL);
};

export const moveToWishlistFromCart = async (id) => {
  const URL = `Order/MoveToWish?cartItemId=${id}`;
  return await get(URL);
};

export const increaseCartItem = async (id) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/CartItemAddQty?cartItemId=${id}`;
  return await get(URL);
};

export const decreaseCartItem = async (id) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/CartItemSubQty?cartItemId=${id}`;
  return await get(URL);
};

export const addToCart = async (urlKey, Qty) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/AddToCart`;
  let searchResult = await post(URL, {
    productQty: Qty ? Qty : 1,
    cusId: profile.bkCustId ? profile.bkCustId : null,
    guestId: profile.bkCustId ? null : profile.guestId,
    urlKey: urlKey,
  });
  return searchResult;
};

export const productBuyNow = async (urlKey, Qty) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/BuyNow`;
  let searchResult = await post(URL, {
    productQty: Qty ? Qty : 1,
    cusId: profile.bkCustId ? profile.bkCustId : null,
    guestId: profile.bkCustId ? null : profile.guestId,
    urlKey: urlKey,
  });
  return searchResult;
};

export const getSearchList = async (payload) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Product/Search`;
  let searchResult = await post(URL, {
    custId: profile.bkCustId ? profile.bkCustId : null,
    guestId: profile.bkCustId ? null : profile.guestId,
    pincode: profile.pincode,
    ...payload,
  });
  return searchResult;
};

export const getSearchFilterData = async (payload) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Product/SearchFilter`;
  let searchResult = await post(URL, {
    custId: profile.bkCustId ? profile.bkCustId : null,
    guestId: profile.bkCustId ? null : profile.guestId,
    vendorUrlKey: profile.pincode,
    ...payload,
  });
  return searchResult;
};

export const getVendorData = async (payload) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Vendor/Search`;
  let searchResult = await post(URL, {
    custId: profile.bkCustId ? profile.bkCustId : null,
    guestId: profile.bkCustId ? null : profile.guestId,
    pincode: profile.pincode,
    ...payload,
  });
  return searchResult;
};

export const getSearchAutoCompleteList = async (payload) => {
  const URL = `Product/SearchAutoComplete?term=${payload}`;
  let searchResult = await get(URL);
  return searchResult;
};

export const getTopSellerList = async () => {
  const URL = `TopSeller`;
  return await get(URL);
};

export const getWishList = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/WishLists?custId=${profile.bkCustId ? profile.bkCustId : ''
    }&guestId=${profile.bkCustId ? '' : profile.guestId}`;
  return await get(URL);
};

export const getRefHistory = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Customer/ReferalHistory?custId=${profile.bkCustId ? profile.bkCustId : ''}&type=`;
  return await get(URL);
};

export const getBCoin = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Account/getBCoinDetails?custId=${profile.bkCustId ? profile.bkCustId : ''}`;
  return await get1(URL);
};

export const redeemBCoin = async (payload) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/BcoinRedeemRequest`;
  return await post(URL, payload);
};

export const getBToken = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Account/getBTokenDetails?custId=${profile.bkCustId ? profile.bkCustId : ''}`;
  return await get1(URL);
};

export const getValueHistory = async () => {
  const URL = `Account/getBCoinValueHistory?custId=4`;
  return await get1(URL);
};

export const getCoinRedeemModes = async () => {
  const URL = `Account/getAvailableRedeemModes?custId=4`;
  return await get1(URL);
};

export const getWallet = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Account/getWalletDetails?userId=${profile.bkCustId ? profile.bkCustId : ''}`;
  return await get(URL);
};

export const redeemWallet = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Customer/updRedeemRequest?id=${profile.bkCustId ? profile.bkCustId : ''}`;
  return await post(URL);
};

export const getLanguageList = async (LangCode) => {
  //let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `mobLanguage?lg=${LangCode}`;
  return await get(URL);
};

export const removeFromWishList = async (id) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/InsertWishListsDel?custId=${profile.bkCustId ? profile.bkCustId : ''
    }&guestId=${profile.bkCustId ? '' : profile.guestId}&urlKey=${id}`;
  let searchResult = await post(URL);
  return searchResult;
};

export const addToWishList = async (urlKey) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/InsertWishLists?`;
  let searchResult = await post(URL, {
    custId: profile.bkCustId ? profile.bkCustId : null,
    guestId: profile.bkCustId ? null : profile.guestId,
    urlKey: urlKey,
  });

  return searchResult;
};

export const addressList = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/CusAddressList?cusId=${profile.bkCustId ? profile.bkCustId : ''
    }`;
  return await get(URL);
};

export const DeleteAddress = async (payload) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Customer/DelAddress/${payload}`;
  return await get(URL);
};

export const addAddress = async (payload) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `NewAddress`;
  let searchResult = await post(URL, payload);
  return searchResult;
};

export const updateAddress = async (payload) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Customer/UpdateAddress`;
  let searchResult = await post(URL, payload);
  return searchResult;
};

export const placeOrder = async (payload) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order`;
  let searchResult = await post(URL, {
    custId: profile.bkCustId ? profile.bkCustId : null,
    ...payload,
  });
  return searchResult;
};

export const getCategory = async () => {
  const URL = `category/TopCategory`;
  return await get(URL);
}

export const getCategoryArchive = async (URL) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  URL = `${URL}?custId=${profile.bkCustId ? profile.bkCustId : ''}&guestId=${profile.bkCustId ? '' : profile.guestId
    }`;
  return await get(URL);
};

export const getBrandList = async (URL) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  URL = `BrandList`;
  return await get(URL);
};


export const catBrandList = async (url) => {
  const URL = `catBrandList?catUrlKey=${url}`;
  return await get(URL);
};

export const getLatestArrival = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `LatestArrival?custId=${profile.bkCustId ? profile.bkCustId : ''
    }&guestId=${profile.bkCustId ? '' : profile.guestId}`;
  return await get(URL);
};

export const getRecentProducts = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `RecentProducts?custId=${profile.bkCustId ? profile.bkCustId : ''}&guestId=${profile.bkCustId ? '' : profile.guestId}`;
  return await get(URL);
};

export const getRecommendedProducts = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `RecommendedProducts?custId=${profile.bkCustId ? profile.bkCustId : ''
    }&guestId=${profile.bkCustId ? '' : profile.guestId}&pincode=${profile.pincode}`;
  return await get(URL);
};

export const getDealOfTheDay = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `DealOfDay?custId=${profile.bkCustId ? profile.bkCustId : ''
    }&guestId=${profile.bkCustId ? '' : profile.guestId}`;
  return await get(URL);
};

export const writeToUs = async (email, phone, title, message) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Support`;
  let response = await post(URL, {
    custId: profile.bkCustId ? profile.bkCustId : null,
    email: email,
    mobile: phone,
    title: title,
    message: message,
  });
  return response;
};

export const shopByCategory = async () => {
  const URL = `category`;
  return await get(URL);
};

export const getPaymentMethods = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/PaymentModes`;
  return await get(URL);
};

export const initiatePayment = async (id) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `OrderPaymentInitiate?orderId=${id}`;
  return await get(URL);
};

export const completePayment = async (id) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `OrderComplete?orderId=${id}`;
  return await get(URL);
};

export const getGiftCards = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/GetAvailableGiftCards?custId=${profile.bkCustId ? profile.bkCustId : ''}`;
  return await get(URL);
};

export const postApplyGiftCard = async (Code) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/ApplyGiftCard`;
  let response = await post(URL, {
    custId: profile.bkCustId ? profile.bkCustId : null,
    giftCardIds: Code,
  });
  return response;
};

export const getCoupons = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `CouponList?custId=${profile.bkCustId ? profile.bkCustId : ''
    }&guestId=${profile.bkCustId ? '' : profile.guestId}`;
  return await get(URL);
};

export const applyBCoin = async (coin) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/ApplyBCoins?`;
  let response = await post(URL, {
    custId: profile.bkCustId ? profile.bkCustId : null,
    bCoinsAmount: coin,
  });
  return response;
};

export const removeBCoin = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/ApplyBCoins?`;
  let response = await post(URL, {
    custId: profile.bkCustId ? profile.bkCustId : null,
  });
  return response;
};

export const applyCoupon = async (Code) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `Order/ApplyCouponCode?`;
  let response = await post(URL, {
    custId: profile.bkCustId ? profile.bkCustId : null,
    ccode: Code,
  });
  return response;
};

export const removeCoupon = async () => {

  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `RemoveCoupon?`;
  let config = {
    headers: {
      'custId': profile.bkCustId,
      'pincode': profile.pincode,
    }
  }
  let response = await get(URL, config);
  return response;
};

export const getProfile = async (URL) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  URL = `CustomerDetails?custId=${profile.bkCustId ? profile.bkCustId : ''}`;
  return await get(URL);
};

export const updateProfile = async (email, phone, name) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `ProfileUpdate?`;
  let response = await post(URL, {
    custId: profile.bkCustId ? profile.bkCustId : null,
    custName: name,
    emailId: email,
    phoneNo: phone,
  });
  return response;
};

export const changePincode = async (term) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  URL = `Customer/getPincodeList?term=${term}`;
  return await get(URL);
};

export const areaList = async (code) => {
  URL = `Customer/getAreaNameList?term=${code}`;
  return await get(URL);
}

export const checkUser = async (id) => {
  URL = `Customer/UserExistCheck?UserName=${id}`;
  return await get(URL);
};

export const getPolicies = async () => {
  const URL = `CompanyPolicy`;
  return await get(URL);
};

export const getCountry = async () => {
  const URL = `CountryList`;
  return await get(URL);
};

export const getState = async (id) => {
  URL = `StateList?CountryId=${id}`;
  return await get(URL);
};

export const getDistrict = async (id) => {
  URL = `CityList?stateId=${id}`;
  return await get(URL);
};
