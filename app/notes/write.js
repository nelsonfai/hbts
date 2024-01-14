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
import Icon from 'react-native-vector-icons/FontAwesome';
const handleHead = ({ tintColor }) => (
  <Text style={{ color: tintColor }}>H1</Text>
);
const handleHead2 = ({ tintColor }) => (
  <Text style={{ color: tintColor }}>H2</Text>
);

const App = () => {
  const params = useLocalSearchParams();
  const [change, setChange] = useState(false);
  const [initialText, setInitialText] = useState("");
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [title, setTitle] = useState(""); 
  const {refresh,setRefresh} = useRefresh();

  const richText = React.useRef();

  useEffect(() => {
    if (params.id) {
      fetchInitialText();
    }
  }, [params.id]);



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
		router.replace("/notes");
		setChange(false)
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
      {isKeyboardVisible && (
        <RichToolbar
          style={styles.toolbarContainer}
          editor={richText}
          iconTint="#312921"
          actions={[
            actions.undo,
            actions.setBold,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.insertLink,
            actions.setItalic,
            actions.setUnderline,
            actions.heading1,
            actions.heading2,
          ]}
        />
      )}
      <ScrollView showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >

		  <View style={{flexDirection:'row',alignItems:'flex-start',padding:10,gap:5,marginTop: isKeyboardVisible ? 50 : 10,}}>
		  <Icon name="bookmark" size={22} color={'black'} />
		  <TextInput
		  	numberOfLines={5}
            style={[styles.titleInput]}
            placeholder="Enter title..."
            value={title}
            onChangeText={(text) => 
				{setChange(true)
				setTitle(text)}}
          />
			</View>

          <RichEditor
			editorStyle={{
				color: 'black',
				padding:'50px',
				caretColor:'black',
				backgroundColor:COLORS.lightWhite
			  }}
            caretColor="red"
            ref={richText}
            onChange={(descriptionText) => {
              setChange(true);
            }}
            placeholder={"Body ..."} 
          />
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  toolbarContainer: {
    position: "absolute",
    backgroundColor: "whitesmoke",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  richEditor: {
flex:1  },
  titleInput:{
	fontSize:22,
	fontWeight:500,
	flex:1
  }
});

export default App;
