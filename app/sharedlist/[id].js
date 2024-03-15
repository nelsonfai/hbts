import React, { useState, useEffect ,useRef,useContext} from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet, SafeAreaView, ScrollView ,TouchableWithoutFeedback,Modal,TextInput,KeyboardAvoidingView,Platform, Alert} from "react-native";
import ListItem from "../../components/sharedlist/shareListItem";
import { API_BASE_URL, colorOptions } from "../../appConstants";
import CircularProgressBar from '../../components/sharedlist/circularProgress'
import SearchComponent from "../../components/sharedlist/addListItem";
import { useLocalSearchParams, useRouter ,Stack} from "expo-router";
 import AsyncStorageService from "../../services/asyncStorage";
 import Icon from 'react-native-vector-icons/FontAwesome';
import AddSharedListModal from "../../components/sharedlist/CollectiveListModal";
import { useRefresh } from "../../context/refreshContext";
import I18nContext from "../../context/i18nProvider";
import { COLORS } from "../../constants";
import NetInfo from '@react-native-community/netinfo';

import NetworkStatus from "../../components/NetworkStatus";

const ListItemDetailsScreen = () => {
  const router = useRouter();
  const {setRefresh} = useRefresh()
  const {i18n,locale} = useContext(I18nContext)
  const params = useLocalSearchParams();
  const [listItems, setListItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [editingItemId, setEditingItemId] = useState(null);
  const swipeableRefs = {};
  const [openSwipeables, setOpenSwipeables] = useState([]);
  const[network,setNetWork] = useState(true)
  const [showAddListModal, setShowAddListModal] = useState(false);
  const [itemCountStats, setItemCountStats] = useState({
    totalCount: 0,
    doneCount: 0,
  });
  const [selectedItem, setSelectedItem] = useState({    
    id:params.id,
    title:params.name,
    color:params.color,
    description:params.description,
    dueDate:params.dateline,

    isSharedValue:true}); 
  const userHasTeam = params.hasTeam;

  const unsubscribe = NetInfo.addEventListener(state => {
    NetInfo.fetch().then(state => {
      setNetWork(state.isConnected)
    });
  });
  useEffect(() => {
    if (params.id) {
      fetchListItems();
    }
  }, [params.id]);

  useEffect(() => {
    setItemCountStats(calculateItemCountStats());
  }, [listItems]);

  const fetchListItems = async () => {
    unsubscribe()
    if(!network){
      console.log('Network',network)
      setIsLoading(false)
      return
    }
    const token = await AsyncStorageService.getItem('token')
    try {
      const allListUrl = `${API_BASE_URL}/collaborative-lists/${params.id}/items/`
      const response = await fetch(allListUrl, {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${token}`,
          },
      });

      const data = await response.json();
      if (error) {
        throw new Error(`Error fetching list items: ${error.message}`);
      }
      setListItems(data.items);
      console.log(data.list_info)
      setSelectedItem({
        id: data.list_info.id,
        title: data.list_info.title,
        color: data.list_info.color,
        description: data.list_info.description,
        dueDate: data.list_info.dateline,
        isSharedValue: data.list_info.team,
      });
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };
  const deleteList = async () => {  
    // Use Alert to confirm deletion
    Alert.alert(
      i18n.t('listDetails.forms.confirmDelete'),
      i18n.t('listDetails.forms.deleteText'),
      [
        {
          text: i18n.t('listDetails.forms.cancelButton'),
          style: 'cancel',
          onPress: () => {
          },
        },
        {
          text: i18n.t('listDetails.forms.deleteButton'),
          onPress: async () => {
            unsubscribe()
            if(!network){
              return
            }
            try {
              const token = await AsyncStorageService.getItem('token');
              const id = selectedItem.id
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
                setIsLoading(false); // Assuming setIsLoading is a state updater
                // Close the modal, you need to have a function to handle modal visibility
                setRefresh({ refreshHabits: false, refreshList: true,refreshSummary:false,refreshNotes:false });

                router.push('/home')

              } else {
                const errorData = await response.json();
                console.log(errorData)
                if (errorData.detail === "You do not have permission to delete this object.") {
                  Alert.alert(i18n.t('listDetails.forms.noDeletePermission'))
              }
                setIsLoading(false);
              }
            } catch (error) {
              console.error('Error updating item text:', error.message);
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };
  function formatDate(inputDate) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = new Date(inputDate).toLocaleDateString(locale, options);
    return formattedDate;
  }
  const handleDelete = async (itemId) => {
          unsubscribe()
          if(!network){
            return
          }
        try {
          const token = await AsyncStorageService.getItem('token');
          const apiUrl = `${API_BASE_URL}/items/${itemId}/`;
          const requestOptions = {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${token}`,
            },
          };    
          const response = await fetch(apiUrl, requestOptions);

          if (response.ok) {
            setRefresh({ refreshHabits: false, refreshList: true,refreshSummary:false ,refreshNotes:false});
            setListItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
          } else {
            const errorData = await response.json();
            console.error('Error deleting item:', errorData);
          }
        } catch (error) {
          console.error('Error deleting item:', error.message);
          // Handle the error (e.g., show an error message)
        }
      };
    const updateItem = async (itemId, requestData) => {
      unsubscribe()
      if(!network){
        return
      }
      try {
        const token = await AsyncStorageService.getItem('token')
    
        const apiUrl =  `${API_BASE_URL}/items/${itemId}/`
        const requestOptions = {
          method: 'PATCH', 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`, 
          },
          body: JSON.stringify(requestData),
        };
    
        const response = await fetch(apiUrl, requestOptions);
        if (response.ok) {
          fetchListItems();
          setRefresh({ refreshHabits: false, refreshList: true,refreshSummary:false ,refreshNotes:false});


        } else {
          // Handle errors
          const errorData = await response.json();
          console.error('Error updating item:', errorData);
        }
      } catch (error) {
        console.error('Error updating item:', error);
      }
    };
    
    const updateItemText = async (editingItemId, editedText) => {
      const requestData = {
        text: editedText,
      };
      try{
        await updateItem(editingItemId, requestData);
        if (swipeableRefs[editingItemId]) {
          swipeableRefs[editingItemId]._close(); 
        }
      }
      catch (error) {
        console.error('Error updating item text:', error.message);
      }
      closeEditModal()
    };
  
    const updateItemDoneStatus = async (itemId, is_done) => {
      const requestData = {
        done: is_done,
      };
      await updateItem(itemId, requestData);
    };    

  const calculateItemCountStats = () => {
    let totalCount = listItems.length;
    let doneCount ;
    let percentage ;
    if (totalCount === 0){
      percentage = 0
      doneCount = 0
    }else{
      doneCount = listItems.filter(item => item.done).length;
      percentage = (doneCount / totalCount) * 100
    }
    return {
      totalCount,
      doneCount,
      percentage
    };
  };



{/* Modal functions */}
const openEditModal = (itemId, text) => {
  setEditingItemId(itemId);
  setEditedText(text);
  setEditModalVisible(true);
};

const closeEditModal = () => {
  setEditingItemId(null);
  setEditedText("");
  setEditModalVisible(false);
};


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
        <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerTintColor: 'grey', 
          headerRight: () =>
          <View style={{flexDirection:'row',gap:25}}>
                <TouchableOpacity 
                    onPress={deleteList} >
                    <Icon name="trash" size={25} style={{ color: 'grey' }} />
               </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setShowAddListModal(true)} >
                  <Icon name="edit" size={25} style={{ color: 'grey' }} />
            </TouchableOpacity>
          </View>
          ,
          headerTitle: '',
        }} 
      />
      <View style={{ paddingHorizontal: 15 }}>
        <View style={[styles.sharedlistContainer]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{flex:1}}> 
              <Text style={styles.title}> {selectedItem.title}</Text>
              <Text style={{paddingLeft:5,fontSize:16}}>{itemCountStats.doneCount} | {itemCountStats.totalCount} {i18n.t('listDetails.completed')}</Text>
             { selectedItem.dueDate ? <Text style={{paddingTop:5,fontSize:16,color:'grey'}}> {i18n.t('listDetails.dueBy')}: {formatDate(selectedItem.dueDate)}</Text> : null}
            </View>
            <CircularProgressBar percentage={itemCountStats.percentage} tintColor={selectedItem.color} radius={30} />
          </View>
        </View>
        <SearchComponent color={selectedItem.color} sharedListId={selectedItem.id} updateList={fetchListItems} placeholderText={i18n.t('listDetails.forms.addPlaceholder')}  network={network}/>
        </View>
        <View style={styles.container}>
  {isLoading ? (
    <ActivityIndicator size={15} color={'grey'} />
  ) : error ? (
    <View>
      <Text>Error Loading Data:</Text>
      <Text>{error}</Text>
    </View>
  ) : network ?  (
    <FlatList
      data={listItems}
      keyExtractor={(item) => (item.id ? item.id.toString() : item.title)}
      renderItem={({ item }) => (
        <ListItem
          item={item}
          handleCheckButtonPress={updateItemDoneStatus}
          handleDeleteButtonPress={handleDelete}
          onEdit={openEditModal}
          color={selectedItem.color}
          swipeableRefs={swipeableRefs}
        />
      )}
    />
  ):(
    <NetworkStatus />
  ) }
</View>

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={closeEditModal}
      >

        <View style={styles.modalContainer}>
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ width: '100%', margin: 'auto' }}
          >
          <View style={styles.modalContent}>
            <TextInput
              style={styles.editTextInput}
              placeholder={i18n.t('listDetails.forms.editPlaceholder')}
              value={editedText}
              onChangeText={(text) => setEditedText(text)}
              multiline={true} // Set multiline to true
              numberOfLines={6} // You can adjust the number of lines as needed
            />
            <TouchableOpacity
              style={[styles.saveButton, {backgroundColor: selectedItem.color}]}
              onPress={() => updateItemText(editingItemId, editedText)}>
              <Text style={styles.saveButtonText}>{i18n.t('listDetails.forms.updateButton')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
            style={[styles.saveButton, {backgroundColor: selectedItem.color}]}
            onPress={closeEditModal}>
              <Text style={styles.saveButtonText}>{i18n.t('listDetails.forms.cancelButton')}</Text>
            </TouchableOpacity>

          </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Modal for Add Shared List */}
      <AddSharedListModal
        visible={showAddListModal}
        onClose={() => setShowAddListModal(false)}
        callBack={fetchListItems}
        userHasTeam={userHasTeam}
        updateList={fetchListItems} // Add this line if needed
        selectedList={selectedItem} // Pass the selected item details
        isharedIniValue={selectedItem.isSharedValue}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    marginBottom: 10,
    textTransform:'capitalize'
  },
  sharedlistContainer: {
    padding: 10,
    paddingVertical:15,
    borderRadius:10,
    backgroundColor:'white',
    justifyContent:"center",
    borderWidth:1,
    borderColor:'#f2f2f2',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'red'
    },
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      backgroundColor:'rgba(0, 0, 0, 0.4)',
    },
    modalContent: {
      padding: 10,
      backgroundColor: "white",
      borderRadius: 10,
      paddingBottom:40
    },
    editTextInput: {
      height: 150,
      marginVertical: 20,
      padding:15,
      fontSize:16,
      backgroundColor:'whitesmoke',
      borderRadius:10
    },
    saveButton: {
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom:15
    },
    saveButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
});

export default ListItemDetailsScreen;