import React, { useEffect, useState } from "react";
import {
  Text,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  TextInput,
  View
} from "react-native";
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { Stack, router, useLocalSearchParams } from "expo-router";
import AsyncStorageService from "../../services/asyncStorage";
import { API_BASE_URL } from "../../appConstants";
import { useRefresh } from "../../context/refreshContext";
import { COLORS } from "../../constants";
import richTextStyle from "../../styles/richtextStyle";
const handleHead = ({ tintColor }) => (
  <Text style={{ color: tintColor }}>Hh</Text>
);
const handleHead2 = ({ tintColor }) => (
  <Text style={{ color: tintColor }}>H2</Text>
);

const App = () => {
  const richText = React.useRef();
  const params = useLocalSearchParams();
  const [change, setChange] = useState(false);
  const [initialText, setInitialText] = useState("");
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [title, setTitle] = useState(""); 
  const {refresh,setRefresh} = useRefresh();


  const setHtml = () => {
    fetchInitialText()
   }
  const fetchInitialText = async () => {
    try {
      const token = await AsyncStorageService.getItem("token");
      const apiUrl = `${API_BASE_URL}/notes/${params.id}/`;

      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      };
      const response = await fetch(apiUrl, requestOptions);
      if (response.ok) {
        const data = await response.json();
        setInitialText(data.body);
		    setTitle(data.title)
          richText.current.setContentHTML(data.body);
        setChange(false); // Set change to false initially
      } else {
        const errorData = await response.json();
        console.error("Error fetching initial text:", errorData);
      }
    } catch (error) {
      console.error("Error fetching initial text:", error.message);
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleDonePress = async (richText, initialText) => {
    try {
      const token = await AsyncStorageService.getItem("token");
      const newBody = await richText.current.getContentHtml();
      const apiUrl = params.id
        ? `${API_BASE_URL}/notes/${params.id}/`
        : `${API_BASE_URL}/notes/`;

      const requestOptions = {
        method: params.id ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({title:title, body: newBody }),
      };

      const response = await fetch(apiUrl, requestOptions);

      if (response.ok) {
    		setChange(false)
        richText.current.blurContentEditor();


		    setRefresh({ refreshHabits: false, refreshList: false, refreshSummary: false,refreshNotes:true });

      } else {
        const errorData = await response.json();
        console.error("Error updating/add text:", errorData);
      }
    } catch (error) {
      console.error("Error updating/add text:", error.message);
    }
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: {},
          headerShadowVisible: true,
          headerRight: () => (
            <TouchableOpacity onPress={() => handleDonePress(richText, initialText)}>
              {change ? (
                <Text style={{marginRight: 5,marginBottom:7, fontSize: 18, fontWeight: 600 }}>
                  Save
                </Text>
              ) : null}
            </TouchableOpacity>
          ),
          headerTitle: "",
          headerTintColor: "black",
        }}
      />
      
      <ScrollView 
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      style={{flex:1,position:'relative'}}
      >
      <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >

		  <View style={{padding:10,gap:5}}>
		  <TextInput
        multiline={true}
            style={[styles.titleInput]}
            placeholder="Enter title..."
            value={title}
            onChangeText={(text) => 
				{setChange(true)
				setTitle(text)}}
          />
			</View>

    <RichEditor
    editorInitializedCallback={setHtml}
    useContainer={true}

			editorStyle={{
				color: 'black',
				caretColor:'black',
				backgroundColor:COLORS.lightWhite,
        backgroundColor:'red',
        cssText: richTextStyle, 
        flex:1    
			  }}

        contentCSSText={true}
            ref={richText}
            
            onChange={(descriptionText) => {
              setChange(true);
            }}
            placeholder={"Body ..."} 
          />
 </KeyboardAvoidingView>
      </ScrollView>
      <RichToolbar
          style={styles.toolbarContainer}
          editor={richText}
          iconTint="#312921"
          actions={[
            actions.undo,
            actions.setBold,
            actions.setItalic,
            actions.setUnderline,
            actions.checkboxList,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.insertLink,
            actions.heading1,
            actions.heading2,
          ]
        }
        iconMap={{ [actions.heading1]: handleHead, [actions.heading2]: handleHead2 }}

        />
     

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  toolbarContainer: {
    backgroundColor: "whitesmoke",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    padding:10,
    marginEnd:10
  },

  titleInput:{
	fontSize:22,
	fontWeight:500, 
  flex:1,
  backgroundColor:'whitesmoke',
  padding:5,
  borderRadius:5
  }

});

export default App;