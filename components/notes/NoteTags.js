import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  Switch,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { colorOptions } from "../../appConstants";
import AsyncStorageService from "../../services/asyncStorage";
import { API_BASE_URL } from "../../appConstants";

const TagColorModal = ({ visible, onClose, onAdd, setColor,noteId,refreshNotes,ini_shared ,userHasTeam,teamId}) => {
  const [tag, setTag] = useState("");
  const [change, setChange] = useState(false);
  const [isShared ,setIsShared] = useState(Boolean(ini_shared));
  const [selectedColor, setSelectedColor] = useState(setColor);
  const colors = colorOptions;
  
  useEffect(() => {
    setSelectedColor(setColor); 
    setIsShared(Boolean(ini_shared))
  }, [setColor,noteId,ini_shared]);

  const saveTags = () => {
    updateTags()
    onClose();
  };

  const updateTags = async () => {
    let team  = teamId;
    if (isShared === false){
      team = null
    }
    try {
      const token = await AsyncStorageService.getItem("token");
      const apiUrl = `${API_BASE_URL}/notes/${noteId}/`
      const requestOptions = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({color:selectedColor,team:team}),
      };

      const response = await fetch(apiUrl, requestOptions);

      if (response.ok) {
    		setChange(false)
        refreshNotes()

      } else {
        const errorData = await response.json();
        //("Error updating/add text:", errorData);
      }
    } catch (error) {
      //("Error updating/add text:", error.message);
    }
  };
 
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%', margin: 'auto' }}>

      <ScrollView>

        <View style={styles.modalContent}>
  
          <Text> Select Color </Text>
          <View style={styles.colorContainer}>
  
            {colors.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.colorItem,
                  { backgroundColor: item },
                  selectedColor === item && styles.selectedColorItem,
                ]}
                onPress={() => {
                  setChange(true);
                  setSelectedColor(item);
                }}
              />
            ))}
          </View>     

          <View style={{ flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{ marginRight: 10 }}>Share With Partner</Text>
              <Switch
                value={isShared}
                onValueChange={(value) => {
                  setIsShared(value)
                  setChange(true)
                }}
                trackColor={{ false: 'white', true:'black'}}
                disabled={!userHasTeam}
              />
            </View>
            {userHasTeam && (
              <View style={{ marginBottom: 10 }}>
                <TouchableOpacity
                  style={{
                    marginTop: 5,
                  }}
                  onPress={() => {
                    // Handle create/join team action
                  }}
                >
                  <Text style={{ color: 'grey' }}>Create to Join</Text>

                </TouchableOpacity>
              </View>
            )}
              <TouchableOpacity
                style={{
                  backgroundColor: 'black',
                  padding: 15,
                  borderRadius: 10,
                  alignItems: 'center',
                  marginTop: 10,
                }}
                onPress={saveTags}
              >
                  <Text style={{ color: 'white' }}>Save</Text>
                </TouchableOpacity>
            <TouchableOpacity
                style={{
                  backgroundColor: 'black',
                  padding: 15,
                  borderRadius: 10,
                  alignItems: 'center',
                  marginTop: 10,
                }}
                onPress={onClose}
              >
                <Text style={{ color: 'white' }}>Cancel</Text>
              </TouchableOpacity>
          

        </View>
        </ScrollView>
        
    
      </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  input: {
    flex:1,
    fontSize:16
  },
  colorItem: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  colorContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom:25
  },
  addButton: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
  },

  tagItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    padding: 5,
    marginVertical: 5,
  },
  tagText: {
    marginRight: 5,
  },
  tagList: {
    flexDirection: "row",
    gap: 5,
    marginVertical: 25,
    flexWrap: "wrap",
    display:'none'
  },
  cancelButton: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: "lightgray",
  },
 
  selectedColorItem: {
    borderWidth: 3,
    borderColor: "black", // Add a black border for the selected color
  },
});

export default TagColorModal;
