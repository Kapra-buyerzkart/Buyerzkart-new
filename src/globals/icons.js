import React from 'react';
import { Image, View } from 'react-native';

//importing icons
import shoppingbag from '../assets/icons/shoppingbag.png';
import profile from '../assets/icons/profile.png';
import search from '../assets/icons/search.png';
import wishlist from '../assets/icons/wishlist.png';
import heart from '../assets/icons/heart.png';
import heart1 from '../assets/icons/heart1.png';
import menu from '../assets/icons/menu.png';
import menu1 from '../assets/icons/menu1.png';
import rightarrow from '../assets/icons/rightarrow.png';
import bin from '../assets/icons/bin.png';
import star from '../assets/icons/star.png';
import cart from '../assets/icons/cart.png';
import download from '../assets/icons/download.png';
import google from '../assets/icons/google.png';
import facebook from '../assets/icons/facebook.png';
import lightning from '../assets/icons/lightning.png';
import password from '../assets/icons/password.png';
import padlock from '../assets/icons/padlock.png';
import logout from '../assets/icons/logout.png';
import chrome from '../assets/icons/chrome.png';
import lock from '../assets/icons/lock.png';
import lock1 from '../assets/icons/lock1.png';
import address from '../assets/icons/address.png';
import addressPin from '../assets/icons/addressPin.png';
import address_thin from '../assets/icons/address_thin.png';
import edit from '../assets/icons/edit.png';
import tick from '../assets/icons/tick.png';
import bin1 from '../assets/icons/bin1.png';
import back from '../assets/icons/back.png';
import back2 from '../assets/icons/back2.png';
import save from '../assets/icons/save.png';
import mail from '../assets/icons/mail.png';
import pdf from '../assets/icons/pdf.png';
import support from '../assets/icons/support.png';
import msg_tick from '../assets/icons/msg_tick.png';
import copy from '../assets/icons/copy.png';
import expand from '../assets/icons/expand.png';
import downArrow from '../assets/icons/downArrow.png';
import eye from '../assets/icons/eye.png';
import list from '../assets/icons/list.png';
import deal from '../assets/icons/deal.png';
import heartFill from '../assets/icons/heartFill.png';
import nullCart from '../assets/icons/null-category.png';
import share from '../assets/icons/share.png';
import booking from '../assets/icons/booking.png';
import creditcard from '../assets/icons/creditcard.png';
import netbanking from '../assets/icons/netbanking.png';
import rightTick from '../assets/icons/rightTick.png';
import deliveryTruck from '../assets/icons/deliveryTruck.png';
import delivery from '../assets/icons/delivery.png';
import call from '../assets/icons/call.png';
import whatsapp from '../assets/icons/whatsapp.png';
import close from '../assets/icons/close.png';
import COD from '../assets/icons/COD.png';
import home from '../assets/icons/home.png';
import home1 from '../assets/icons/home1.png';
import filters from '../assets/icons/filters.png';
import mathplus from '../assets/icons/math-plus.png';
import mathminus from '../assets/icons/math-minus.png';
import clock from '../assets/icons/clock.png';
import notifications from '../assets/icons/notifications.png';
import privacy from '../assets/icons/privacy.png';
import terms from '../assets/icons/terms.png';
import wallet from '../assets/icons/wallet.png';
import gift from '../assets/icons/gift.png';
import debit from '../assets/icons/debit.png';
import credit from '../assets/icons/credit.png';
import refer from '../assets/icons/refer.png'
import Cart2 from '../assets/icons/Cart2.png';
import CatSearch from '../assets/icons/CatSearch.png';
import HeartThick from '../assets/icons/HeartThick.png';
import Home2 from '../assets/icons/Home2.png';
import Profile2 from '../assets/icons/Profile2.png';
import upArrow from '../assets/icons/upArrow.png'
import location from '../assets/icons/location.png'
import right3 from '../assets/icons/right3.png'
import orders from '../assets/icons/orders.png'
import bCoin from '../assets/icons/bCoin.png'
import about from '../assets/icons/about.png'
import category from '../assets/icons/category.png'
import timer from '../assets/icons/timer.png'
import card from '../assets/icons/card.png'
import deliveryCod from '../assets/icons/deliveryCod.png'
import others from '../assets/icons/others.png'
import work from '../assets/icons/work.png'
import rightTickRound from '../assets/icons/rightTickRound.png'
import shop from '../assets/icons/shop.png'



import { Icon, SearchBar, Badge } from 'react-native-elements';
import { AppContext } from '../Context/appContext';

import colours from './colours';

const showIcon = (icon, color = colours.black, size = 24, TAB) => {

  let src;
  switch (icon) {
    case 'eye':
      src = eye;
      break;
    case 'downArrow':
      src = downArrow;
      break;
    case 'rightTickRound':
      src = rightTickRound;
      break;
    case 'work':
      src = work;
      break;
    case 'shop':
      src = shop;
      break;
    case 'card':
      src = card;
      break;
    case 'others':
      src = others;
      break;
    case 'deliveryCod':
      src = deliveryCod;
      break;
    case 'right3':
      src = right3;
      break;
    case 'timer':
      src = timer;
      break;
    case 'bCoin':
      src = bCoin;
      break;
    case 'rightarrow':
      src = rightarrow;
      break;
    case 'category':
      src = category;
      break;
    case 'location':
      src = location;
      break;
    case 'orders':
      src = orders;
      break;
    case 'Cart2':
      src = Cart2;
      break;
    case 'HeartThick':
      src = HeartThick;
      break;
    case 'home1':
      src = home1;
      break;
    case 'Home2':
      src = Home2;
      break;
    case 'about':
      src = about;
      break;
    case 'Profile2':
      src = Profile2;
      break;
    case 'CatSearch':
      src = CatSearch;
      break;
    case 'refer':
      src = refer;
      break;
    case 'terms':
      src = terms;
      break;
    case 'debit':
      src = debit;
      break;
    case 'credit':
      src = credit;
      break;
    case 'privacy':
      src = privacy;
      break;
    case 'notifications':
      src = notifications;
      break;
    case 'clock':
      src = clock;
      break;
    case 'copy':
      src = copy;
      break;
    case 'wallet':
      src = wallet;
      break;
    case 'gift':
      src = gift;
      break;
    case 'support':
      src = support;
      break;
    case 'pdf':
      src = pdf;
      break;
    case 'mail':
      src = mail;
      break;
    case 'save':
      src = save;
      break;
    case 'back':
      src = back;
      break;
    case 'back2':
      src = back2;
      break;
    case 'bin1':
      src = bin1;
      break;
    case 'tick':
      src = tick;
      break;
    case 'edit':
      src = edit;
      break;
    case 'address':
      src = address;
      break;
    case 'addressPin':
      src = addressPin;
      break;
    case 'lock':
      src = lock;
      break;
    case 'lock1':
      src = lock1;
      break;
    case 'chrome':
      src = chrome;
      break;
    case 'logout':
      src = logout;
      break;
    case 'padlock':
      src = padlock;
      break;
    case 'password':
      src = password;
      break;
    case 'lightning':
      src = lightning;
      break;
    case 'google':
      src = google;
      break;
    case 'facebook':
      src = facebook;
      break;
    case 'download':
      src = download;
      break;
    case 'cart':
      src = cart;
      break;
    case 'star':
      src = star;
      break;
    case 'bin':
      src = bin;
      break;
    case 'shoppingbag':
      src = shoppingbag;
      break;
    case 'profile':
      src = profile;
      break;
    case 'search':
      src = search;
      break;
    case 'wishlist':
      src = wishlist;
      break;
    case 'heart':
      src = heart;
      break;
    case 'heart1':
      src = heart1;
      break;
    case 'heartFill':
      src = heartFill;
      break;
    case 'sidemenu':
      src = menu;
      break;
      case 'menu1':
        src = menu1;
        break;
    case 'rightarrow':
      src = rightarrow;
      break;
    case 'upArrow':
      src = upArrow;
      break;
    case 'msg_tick':
      src = msg_tick;
      break;
    case 'expand':
      src = expand;
      break;
    case 'address_thin':
      src = address_thin;
      break;
    case 'list':
      src = list;
      break;
    case 'deal':
      src = deal;
      break;
    case 'nullCart':
      src = nullCart;
      break;
    case 'share':
      src = share;
      break;
    case 'booking':
      src = booking;
      break;
    case 'creditcard':
      src = creditcard;
      break;
    case 'netbanking':
      src = netbanking;
      break;
    case 'rightTick':
      src = rightTick;
      break;
    case 'deliveryTruck':
      src = deliveryTruck;
      break;
    case 'delivery':
      src = delivery;
      break;
    case 'call':
      src = call;
      break;
    case 'whatsapp':
      src = whatsapp;
      break;
    case 'close':
      src = close;
      break;
    case 'COD':
      src = COD;
      break;
    case 'home':
      src = home;
      break;
    case 'filters':
      src = filters;
      break;
    case 'mathplus':
      src = mathplus;
      break;
    case 'mathminus':
      src = mathminus;
      break;
    default:
      src = shoppingbag;
  }
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
      }}>
      <Image
        source={src}
        style={{
          height: size,
          width: size,
          tintColor: color,
          resizeMode: 'contain',
        }}
      />
      {/* {
        wishCount > 0 && (
          TAB && icon === 'cart' ? <Badge value={wishCount} status="success" containerStyle={{ position: 'absolute', top: 0, right: "25%" }} /> : null
        )
      } */}
    </View>
  );
};
export default showIcon;
