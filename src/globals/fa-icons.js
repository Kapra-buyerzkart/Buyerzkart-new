import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';

export const getFAIcon = (code) => {
  return <Icon name={formatter(code)} size={24} color="#000" />;
};

const formatter = (code) => {
  if (code.includes('fa fa-')) return code.replace('fa fa-', '');
  else if (code.includes('fas fa-')) return code.replace('fas fa-', '');
};
