// Access Device’s Contact List in React Native App
// https://aboutreact.com/access-contact-list-react-native/

// Import React
import React, {useState, useEffect} from 'react';

// Import all required component
import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
} from 'react-native';

import Contacts from 'react-native-contacts';
// import ListItem from './components/ListItem';

const SupportScreen = () => {
  let [contacts, setContacts] = useState([]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
          title: 'Contacts',
          message: 'This app would like to view your contacts.',
        }).then(() => {
          loadContacts();
        }
      );
    } else {
      loadContacts();
    }
  }, []);

  const loadContacts = () => {
    Contacts.getAll()
      .then(contacts => {
        contacts.sort(
          (a, b) => 
          a.givenName.toLowerCase() > b.givenName.toLowerCase(),
        );
        setContacts(contacts);
      })
      .catch(e => {
        alert('Permission to access contacts was denied');
      });
  };

  const search = (text) => {
    const phoneNumberRegex = 
      /\b[\+]?[(]?[0-9]{2,6}[)]?[-\s\.]?[-\s\/\.0-9]{3,15}\b/m;
    if (text === '' || text === null) {
      loadContacts();
    } else if (phoneNumberRegex.test(text)) {
      Contacts.getContactsByPhoneNumber(text).then(contacts => {
        contacts.sort(
          (a, b) => 
          a.givenName.toLowerCase() > b.givenName.toLowerCase(),
        );
        setContacts(contacts);
      });
    } else {
      Contacts.getContactsMatchingString(text).then(contacts => {
        contacts.sort(
          (a, b) => 
          a.givenName.toLowerCase() > b.givenName.toLowerCase(),
        );
        setContacts(contacts);
      });
    }
  };

  const openContact = (contact) => {
    Contacts.openExistingContact(contact);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.header}>
          Access Contact List in React Native
        </Text>
        <TextInput
          onChangeText={search}
          placeholder="Search"
          style={styles.searchBar}
        />
        <FlatList
          data={contacts}
          renderItem={(contact) => {
            return (
              <Text>
                {contact?.item?.displayName?contact.item.displayName:contact.item.givenName} {contact?.item?.phoneNumbers[0]?.number?contact?.item?.phoneNumbers[0]?.number:0}
              </Text>
            );
          }}
          keyExtractor={(item) => item.recordID}
        />
      </View>
    </SafeAreaView>
  );
};
export default SupportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#4591ed',
    color: 'white',
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 20,
  },
  searchBar: {
    backgroundColor: '#f0eded',
    paddingHorizontal: 30,
    paddingVertical: Platform.OS === 'android' ? undefined : 15,
  },
});