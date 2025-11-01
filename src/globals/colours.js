//global colours
const mainColours = {
  primaryColor: '#4B3057',
  secondaryColor: '#f08a04',

  BuyersBlue: '#3156B9',

  primaryPink: '#FF326D',
  lightPink: '#EDE9EF',
  
  primaryOrange: '#ff7900',
  // primaryOrange: '#F1A035',
  lightOrange: '#f0b15d',
  lowOrange: '#fadfbb',

  primaryBlue:'#4B3057',
  lightBlue:'#5b7fba',
  lowBlue:'#E8EEFF',
  darkBlue:'#1B243D',


  primaryWhite: '#ffffff',
  lightWhite: '#e3e3e3',
  lowWhite: '#faf7f7',

  primaryBlack: '#151515',
  primaryGrey: '#70726F',
  lightGrey: '#adadad',
  lowGrey: '#DADFEC',

  primaryYellow: '#ccb802',
  goldenYellow: '#fcad03',

  primaryGreen: '#44B74B',
  lightGreen: '#83de88',
  // lowGreen: '#c6f7c9',
  lowGreen: '#d7f7d9',
  
  primaryRed: "#D71920",
  lightRed: '#F97C80',
  lowRed: '#FBE0E1',


  // kapra colours 
  kapraMain: '#4B3057',
  kapraLight: '#965FAD',
  kapraLow: '#f4e8fa',

  kapraOrange: '#FF7148',
  kapraOrangeLight :'#F04B1B',
  kapraOrangeDark: '#C93D14',
  kapraOrangeLow: '#FDEBE6',

  kapraBrownDark: '#190A07',

  kapraRed:'#D80000',
  kapraRedLow: '#FFD8CD',

  kapraGreenLow: '#ECFEFF',

  kapraWhite:'#FFFFFF',
  kapraWhiteLow: '#F5F5F5',

  kapraBlack: '#000000',
  kapraBlackLight: '#525252',
  kapraBlackLow: '#626262'

};
const colours = {
  ...mainColours,
  authScreens: {
    background: mainColours.whiteBackground,
    text: mainColours.secondaryColor,
    primaryBtn: mainColours.primaryColor,
    secondaryBtn: mainColours.secondaryColor,
  },
};

export default colours;
