import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome"; 
import AsyncStorageService from '../../../services/asyncStorage';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { API_BASE_URL } from '../../../appConstants';
const PopupMenu = ({ ListId, onEdit ,current})=> {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isLoading,setIsLoading] =useState(false)

  const router = useRouter();


  const openMenu = () => {
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };
  const openEdit = () => {
    console.log(current)
    onEdit()
    console.log(current)
    //closeMenu()
  }
  const deleteList = async () => {  
    // Use Alert to confirm deletion
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this list?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            closeMenu()
          },
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              const token = await AsyncStorageService.getItem('token');
              const id = ListId.ListId
              console.log('the key id :' ,ListId)
              const allListUrl = `${API_BASE_URL}/collaborative-lists/${id}/`;
              const response = await fetch(allListUrl, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Token ${token}`,
                },
              });
              if (response.ok) {
                // Delete successful
                console.log('Deletion successful');
                setIsLoading(false); // Assuming setIsLoading is a state updater
                // Close the modal, you need to have a function to handle modal visibility
                router.push('/home')
              } else {
                setIsLoading(false);
              }
            } catch (error) {
              //('Error updating item text:', error.message);
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };


  return (
    <View style={styles2.container}>
      <TouchableOpacity onPress={openMenu}>
        <Icon name="edit" size={25} color='grey' />
      </TouchableOpacity>

      <Modal
        transparent
        animationType="slide"
        visible={isMenuVisible}
        onRequestClose={closeMenu}
      >
        <TouchableOpacity
          style={styles2.modalContainer}
          activeOpacity={1}
          onPressOut={closeMenu}
        >
          <View style={styles2.menu}>
            <TouchableOpacity 
                          onPress={openEdit}
                          >
              <View style={styles2.menuItemContainer}>
              <Icon name="edit" size={25}  />
              <Text style={styles2.menuItem}>Edit</Text>
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={deleteList}>
              
              <View style={styles2.menuItemContainer}>
                <Icon name="trash" size={25} />
                <Text style={styles2.menuItem}>Delete</Text>
            </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles2 = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
    
    },

    modalContainer: {
      flex: 1,
      justifyContent: 'center', // Align the modal to the bottom
      marginBottom: 20, // Adjust the margin to position the modal 20px above the bottom

    },
    menu: {
    backgroundColor:'white',
      padding: 10,
      borderRadius: 10,
      elevation: 35,
      position:'absolute',
      top:95,
      right:10,
      borderWidth:1,
      borderColor:'grey'
    },
    menuItem: {
        fontSize: 18,
        padding: 10,
        textAlign: 'center',
      },
    menuItemContainer:{
        flexDirection:'row',
        alignItems:'center',
        borderBottomColor: 'grey',
        borderBottomWidth: 0.3, // You can adjust the border width as needed
        borderStyle: 'solid', // Add this line
        minWidth:200 ,
        padding:10,

       }
  });
  
  
export default PopupMenu;
