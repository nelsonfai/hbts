import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet,Alert,Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorageService from '../../services/asyncStorage';
import { useRefresh } from '../../context/refreshContext';
import { API_BASE_URL } from '../../appConstants';

const SearchComponent = ({ updateList, color, sharedListId,placeholderText,network }) => {
  const {setRefresh} = useRefresh()
  const [searchText, setSearchText] = useState('');
  const handleSearch = async () => {
    if (!network){
      return 
    }
    try {
      if (!searchText.trim()) {
        return;
      }
      const token = await AsyncStorageService.getItem('token');
      const apiUrl = `${API_BASE_URL}/items/`;
  
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({text:searchText, done: false ,list:sharedListId}), // Adjust the data you want to send
      };
  
      const response = await fetch(apiUrl, requestOptions);

      if (response.ok) {
        updateList(); 
        setSearchText('')
        setRefresh({ refreshHabits: false, refreshList: true,refreshSummary:false,refreshNotes:false });
      } else {
        const errorData = await response.json();
        //('Error creating item :', errorData);
      }
    } catch (error) {
      //('Error creating item:', error.message);
    }
  };


  return (
    <View style={styles.container}>

      <TextInput
        style={styles.input}
        placeholder = {placeholderText}
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
        placeholderTextColor={'grey'}
        fontSize={16} 
      />
      <TouchableOpacity  onPress={handleSearch}>
        <View style={[styles.button]}>
         <Icon name="plus" size={16} color="grey" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap:3,
    height:50,
    marginVertical:10
  },
  input: {
    flex: 1,
    height:50,
    backgroundColor:'#EFEFEF',
    borderTopLeftRadius:10,
    borderBottomLeftRadius:10,
    padding:10,
    ...Platform.select({
      ios: {
        shadowColor: '#EFEFEF',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 0.2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  button: {
    borderTopRightRadius:10,
    borderBottomRightRadius:10,
    backgroundColor:'#EFEFEF',
    width:50,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
borderLeftWidth:0.3,
    borderColor: 'white',
    flex:1,
    ...Platform.select({
      ios: {
        shadowColor: '#EFEFEF',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 0.2,
      },
      android: {
        elevation: 1,
      },
    }),

  },
});

export default SearchComponent;
