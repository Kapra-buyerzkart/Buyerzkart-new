import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import colours from '../../globals/colours';
import { getFontontSize } from '../globals/GroFunctions';

const LocationDropdown = ({
    locations,
    onLocationSelect,
    initialSelectedValue = null
}) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(initialSelectedValue);
    const [items, setItems] = useState([]);

    useEffect(() => {
        // Transform locations for dropdown
        if (locations && locations.length > 0) {
            const dropdownItems = locations.map((location, index) => ({
                label: location.areaName,
                value: location.pincodeAreaId || index.toString(),
                originalData: location
            }));
            setItems(dropdownItems);
        }
    }, [locations]);

    const handleSelectItem = (item) => {
        if (item.value && onLocationSelect) {
            onLocationSelect(item.value);
            // Close dropdown after selection
            setOpen(false);
        }
    };

    if (!locations || locations.length === 0) {
        return (
            <View style={styles.noLocationContainer}>
                <Text style={[styles.fontStyle2, { textAlign: 'center', color: colours.primaryGrey }]}>
                    No locations available
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.dropdownWrapper}>
            <Text style={[styles.dropdownLabel, { textAlign: 'center' }]}>
                Select an available location:
            </Text>
            <View style={styles.dropdownContainer}>
                <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    placeholder="Choose a location..."
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownList}
                    textStyle={styles.dropdownText}
                    placeholderStyle={styles.placeholderText}
                    arrowIconStyle={styles.arrowIcon}
                    tickIconStyle={styles.tickIcon}
                    listItemLabelStyle={styles.listItemLabel}
                    onSelectItem={handleSelectItem}
                    zIndex={3000}
                    zIndexInverse={1000}
                    listMode="MODAL"
                    modalProps={{
                        animationType: "slide"
                    }}
                    modalContentContainerStyle={styles.modalContent}
                    modalTitle="Select Delivery Location"
                    modalTitleStyle={styles.modalTitle}
                    closeAfterSelecting={true}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    dropdownWrapper: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 10,
    },
    dropdownContainer: {
        width: '95%',
        zIndex: 3000,
        marginTop: 5,
    },
    dropdown: {
        backgroundColor: colours.primaryWhite,
        borderColor: colours.kapraOrange,
        borderWidth: 1,
        borderRadius: 8,
    },
    dropdownList: {
        backgroundColor: colours.primaryWhite,
        borderColor: colours.kapraOrange,
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 2,
    },
    dropdownText: {
        fontSize: getFontontSize(14),
        color: colours.primaryBlack,
        fontFamily: 'Lexend-Regular',
    },
    placeholderText: {
        fontSize: getFontontSize(14),
        color: colours.kapraBlackLight,
        fontFamily: 'Lexend-Regular',
    },
    arrowIcon: {
        tintColor: colours.kapraOrange,
    },
    tickIcon: {
        tintColor: colours.kapraOrange,
    },
    noLocationContainer: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 20,
    },
    dropdownLabel: {
        fontFamily: 'Lexend-Regular',
        fontSize: getFontontSize(14),
        color: colours.primaryBlack,
        marginVertical: 5,
    },
    listItemLabel: {
        fontSize: getFontontSize(14),
        color: colours.primaryBlack,
        fontFamily: 'Lexend-Regular',
    },
    modalContent: {
        backgroundColor: colours.primaryWhite,
    },
    modalTitle: {
        fontFamily: 'Lexend-SemiBold',
        fontSize: getFontontSize(16),
        color: colours.primaryBlack,
    },
    fontStyle2: {
        fontFamily: 'Lexend-Light',
        fontSize: getFontontSize(12),
        color: colours.kapraBlackLow
    },
});

export default LocationDropdown;