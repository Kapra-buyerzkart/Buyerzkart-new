import React, {useState, useContext, useEffect} from 'react';
import HomeStackNavigator from '../navigators/HomeStackNavigator';
import {AppContext} from '../Context/appContext';

export default function RootNavigator() {
  const {loadProfile, profile} = useContext(AppContext);
  useEffect(() => {
    loadProfile();
  }, []);
  if (Object.keys(profile).length === 0) return null;
  else return <HomeStackNavigator />;
}
