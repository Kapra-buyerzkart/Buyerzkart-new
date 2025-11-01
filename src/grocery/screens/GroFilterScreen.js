
import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

import CustomLabel from '../components/customLabel';
import {getFontontSize} from '../globals/GroFunctions';
import Header from '../components/Header';
import colours from '../../globals/colours';
import AuthButton from '../components/AuthButton';
import { AppContext } from '../../Context/appContext';
import showIcon from '../../globals/icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function GroFilterScreen({ navigation, route }) {
  let { onGoback, filterData, categoryData, categoryUrlKey } = route.params;
  let attributes = {},
    prevAttr;
    filterData&&filterData.attributes.map((attr) => {
    if (attributes[attr.attrId] === undefined) {
      attributes[attr.attrId] = [attr];
    } else {
      attributes[attr.attrId].push(attr);
    }
  });
  const [price, setPrice] = React.useState([
    filterData.minPrice===filterData.maxPrice?0:filterData.minPrice,
    filterData.maxPrice,
  ]);
  const [selcategory, setSelCategory] = React.useState(categoryUrlKey?categoryUrlKey:'');
  const [categoryStatus, setCategoryStatus] = React.useState(false);
  const [selAttr, setSelAttr] = React.useState([]);
  const [AttrKeyArray, setAttrKeyArray] = React.useState([]);
  const { Language } = React.useContext(AppContext);
  const [selectedAttribute, setSelectedAttribute] = React.useState("Sort");
  const [ selectedSort, setSelectedSort ] = React.useState(filterData.sortOrder)
  const [selectedSortField, setSelectedSortField] = React.useState(filterData.sortField);
  const [dummy, setDummy] = React.useState(true);



  for (const property in attributes) {
    let a = {};
    let key = property;
    let value = attributes[property][0].attrName;
    a[key] = value;
    AttrKeyArray.push(a);
  }

  const pickAttr = (attr) => {
    let pos = selAttr.lastIndexOf(attr.attrValueId);
    if (pos !== -1) {
      // let temp = selAttr;
      selAttr.splice(selAttr.lastIndexOf(attr.attrValueId), 1);
      setSelAttr(selAttr);
      setDummy(!dummy);
    } else {
      setSelAttr([...selAttr, attr.attrValueId]);
      setDummy(!dummy);
    }
  };


  return (
    <SafeAreaView style={styles.mainContainer}>

      {/* Header Con  */}
      <View style={styles.headerCon}>
        <TouchableOpacity style={styles.backButtonCon} onPress={()=>navigation.goBack()}>
          {showIcon('back2', colours.kapraBlack, windowWidth*(5/100))}
        </TouchableOpacity>
        <Text style={styles.titleText}>Filter</Text>
      </View>

      {/* Left Con  */}
      <View style={{flexDirection:'row', width: windowWidth, flex:1, backgroundColor: colours.primaryWhite}}>
        <View style={{ width: windowWidth*(30/100),  backgroundColor: colours.lowWhite}}>
          <TouchableOpacity onPress={() => setSelectedAttribute("Sort")} style={{ height: windowHeight*(6/100), paddingLeft:15, justifyContent:'center', backgroundColor:selectedAttribute == 'Sort'?colours.primaryWhite:colours.lowWhite}}>
            <Text style={styles.headerText}>Sort</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedAttribute("Price")} style={{ height: windowHeight*(6/100), paddingLeft:15, justifyContent:'center', backgroundColor:selectedAttribute == 'Price'?colours.primaryWhite:colours.lowWhite}}>
            <Text style={styles.headerText}>Price Range</Text>
          </TouchableOpacity>
          {Object.keys(attributes).map((key, index) => {
            return (
              <TouchableOpacity onPress={() => setSelectedAttribute(AttrKeyArray[index][key])} style={{ height: windowHeight*(6/100), paddingLeft:15, justifyContent:'center', backgroundColor:selectedAttribute == AttrKeyArray[index][key]?colours.primaryWhite:colours.lowWhite}}>
                <Text style={styles.headerText}>{AttrKeyArray[index][key]}</Text>
              </TouchableOpacity>
          )})}
        </View>
        <View style={{ width: windowWidth*(70/100),}}>
          {
            selectedAttribute == 'Sort'&&(
              <>
              <TouchableOpacity style={styles.itemContainer2} onPress={() => {setSelectedSortField('price'),setSelectedSort('relevence')}}>
                <CustomRadioButton
                  state={selectedSort == 'relevence'?true:false}
                />
                <Text style={[styles.headerText]}>
                  Relevence
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.itemContainer2} onPress={() => {setSelectedSortField('price'),setSelectedSort('latest')}}>
                <CustomRadioButton
                  state={selectedSort == 'latest'?true:false}
                />
                <Text style={[styles.headerText]}>
                Latest
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.itemContainer2} onPress={() => {setSelectedSortField('price'),setSelectedSort('highToLow')}}>
                <CustomRadioButton
                  state={selectedSort == 'highToLow'?true:false}
                />
                <Text style={[styles.headerText]}>
                Price(High to Low)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.itemContainer2} onPress={() => {setSelectedSortField('price'),setSelectedSort('lowToHigh')}}>
                <CustomRadioButton
                  state={selectedSort == 'lowToHigh'?true:false}
                />
                <Text style={[styles.headerText]}>
                Price(Low to High)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.itemContainer2} onPress={() => {setSelectedSortField('prName'),setSelectedSort('a-z')}}>
                <CustomRadioButton
                  state={selectedSort == 'a-z'?true:false}
                />
                <Text style={[styles.headerText]}>
                A-Z
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.itemContainer2} onPress={() => {setSelectedSortField('prName'),setSelectedSort('z-a')}}>
                <CustomRadioButton
                  state={selectedSort == 'z-a'?true:false}
                />
                <Text style={[styles.headerText]}>
                Z-A
                </Text>
              </TouchableOpacity>
              </>
            )
          }
          {
            selectedAttribute == 'Price'&&(
              <View style={{width: windowWidth*(65/100), alignItems:'center', marginTop: 10}}>
                <MultiSlider
                  values={price}
                  sliderLength={windowWidth * (50 / 100)}
                  onValuesChange={(value) => {
                    setPrice(value);
                  }}
                  min={price[0]?price[0]:0}
                  max={price[1]?price[1]:100000}
                  step={1}
                  enableLabel
                  customLabel={CustomLabel}
                  trackStyle={{
                    backgroundColor: colours.primaryGrey,
                    height: 10,
                    borderRadius: 4,
                  }}
                  selectedStyle={{ backgroundColor: colours.kapraMain }}
                  customMarker={customMarker}
                />
              </View>
            )
          }
        {Object.keys(attributes).map((key, index) => {
          return (
            <>
            {
              selectedAttribute === AttrKeyArray[index][key] ?
                <ScrollView>
                  {
                    attributes[key].map((attr) => {
                      return (
                          <TouchableOpacity
                            style={styles.itemContainer2}
                            onPress={() => pickAttr(attr)}>

                            <CustomRadioButton
                              state={selAttr.includes(attr.attrValueId)?true:false}
                            />
                            <Text
                              style={[
                                styles.headerText,
                                selAttr.includes(attr.attrValueId)
                                  ? { color: colours.primaryGreen }
                                  : {color: colours.kapraMain},
                              ]}>
                              {attr.attrValue}
                            </Text>
                          </TouchableOpacity>
                      )
                    })
                  }
                </ScrollView>
                :
                null
            }
            </>
        )})}
        
        </View>
      </View>
      <View
          style={{
            flexDirection:'row',
            justifyContent:'flex-end',
            width:windowWidth*(94/100)
          }}>
            <AuthButton
            FirstColor={colours.primaryRed}
            SecondColor={colours.lightRed}
            OnPress={() => {
              setSelCategory('');
              setSelAttr([]);
              setPrice([filterData.minPrice===filterData.maxPrice?0:filterData.minPrice,filterData.maxPrice,])
              onGoback({
                minPrice: price[0],
                maxPrice: price[1],
                sortField:selectedSortField,
                sortOrder:selectedSort,
                filter: {
                  category: selcategory,
                },
                filtervalues: selAttr.toString(),
                status: false
              });
              navigation.goBack();
            }}
            ButtonText={'Clear'}
            ButtonWidth={30}
            ButtonHeight={4}
          />
          <Text>{"  "}</Text>
          <AuthButton
            FirstColor={colours.primaryGreen}
            SecondColor={colours.lightGreen}
            OnPress={() => {
              onGoback({
                minPrice: price[0],
                maxPrice: price[1],
                sortField:selectedSortField,
                sortOrder:selectedSort,
                filter: {
                  category: selcategory,
                },
                filtervalues: selAttr.toString(),
                status: true
              });
              navigation.goBack();
            }}
            ButtonText={'Apply'}
            ButtonWidth={30}
            ButtonHeight={4}
          />
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colours.kapraWhite,
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

  titleText: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(18),
    color: colours.kapraBlack,
  },




  headerText: {
    fontFamily: 'Lexend-Medium',
    fontSize: getFontontSize(13),
    color: colours.primaryBlack
  },
  itemContainer2: {
    paddingLeft: 15,
    paddingVertical:10,
    flexDirection:'row',
    alignItems:'center',
  },
  fontStyle3: { 
    color: colours.primaryBlack, 
    fontSize: getFontontSize(18),
    fontFamily: 'Lexend-Medium',
  },
  RadioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  checkedButton: {
    width: 14,
    height: 14,
    borderRadius: 14,
    backgroundColor: colours.kapraLight
  },
});

const customMarker = () => (
  <View
    style={{
      width: 22,
      height: 22,
      borderColor: colours.primaryGrey,
      borderWidth: 1,
      borderRadius: 12,
      marginTop: 5,
    }}>
    <View
      style={{
        backgroundColor: colours.kapraMain,
        width: 20,
        height: 20,
        borderColor: colours.primaryWhite,
        borderWidth: 6,
        borderRadius: 10,
      }}
    />
  </View>
);



//Custom RadioButton
const CustomRadioButton = ({ state, check_button, un_check_button, onPress }) => {
  const { Language } = React.useContext(AppContext);
  const Lang = Language;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View
        style={styles.RadioButton}
        // onPress={state === false ? check_button : un_check_button}
      >
        <View style={state === true ? styles.checkedButton : ''} />
      </View>
    </View>
  );
};
