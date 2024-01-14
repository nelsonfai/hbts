import React, { useEffect, useState, useCallback,useRef } from "react";
import {
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  View,
  ActivityIndicator,
  Animated,
  FlatList
} from "react-native";
import AsyncStorageService from "../../services/asyncStorage";
import { API_BASE_URL } from "../../appConstants";
import { COLORS } from "../../constants";
import ProfileImage from "../../components/common/Image";
import { useUser } from "../../context/userContext";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter, Stack } from "expo-router";
import { useRefresh } from "../../context/refreshContext";
import { useFocusEffect } from "expo-router";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useSwipeable } from "../../context/swipeableContext";
const NoteListItem = ({ note, user, details, onDelete ,swipeableRefs}) => {
  const formattedDate = new Date(note.date).toLocaleDateString();

  const swipeableRef = useRef(null);

  const {openRowId, setOpenRowId } = useSwipeable({
    listOpenId:null,
    habitOpenid:null,
    noteOpenid:null
  })

  useEffect(() => {
    swipeableRefs[note.id] = swipeableRef.current;
    return () => {
      swipeableRefs[note.id] = null;
    };
  }, [note.id, swipeableRefs]);


  const handleSwipeOpen = (index) => {
    console.log('New Ref', index, Object.keys(swipeableRefs).length);
  
    if (openRowId?.noteOpenid !== null) {
      const prevRef = swipeableRefs[openRowId?.noteOpenid];
      if (prevRef){
        prevRef && prevRef.close();
      }
    }
  
    if (openRowId?.noteOpenid !== index) {
      setOpenRowId((prevOpenRowId) => ({
        ...prevOpenRowId,
        noteOpenid: index,
        listOpenId: null,
        habitOpenid: null,
      }));
    }
  };
  const renderRightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-50, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.deleteButton}>
        <TouchableOpacity
          onPress={() => {
            onDelete (note.id);
          }}>
          <View style={[styles.actionButton]}>
            <Icon name="trash" size={25} color='grey' />
          </View>
        </TouchableOpacity>

      </View>
    );
  };

  return (
    <Swipeable
        ref={swipeableRef}
      renderRightActions={renderRightActions}
      friction={2}
      rightThreshold={40}
      onSwipeableWillOpen={() => { handleSwipeOpen(note.id)}}
    >
      <TouchableOpacity onPress={details}>
        <View style={styles.notesItem}>
          <Text style={styles.title} numberOfLines={1}>
            {note.title}
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={styles.dateContainer}>
              <Icon name="calendar" size={18} color={"grey"} />
              <Text style={styles.date}>{formattedDate}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const App = () => {
  const { user } = useUser();
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { refresh, setRefresh } = useRefresh();
  const swipeableRefs = {};

  const fetchNotes = async () => {
    try {
      const token = await AsyncStorageService.getItem("token");
      const apiUrl = `${API_BASE_URL}/notes/`;

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
        setNotes(data);
      } else {
        const errorData = await response.json();
        console.error("Error fetching notes:", errorData);
      }
    } catch (error) {
      console.error("Error fetching notes:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useFocusEffect(
      useCallback(() => {
        if (refresh.refreshNotes) {
          fetchNotes();
          setRefresh((prevRefresh) => ({
            ...prevRefresh,
            refreshNotes: false,
          }));
        }
      }, [refresh.refreshNotes])
    ); 


  const handleDeleteNote =  (noteId) => {
    console.log('Note Deleted',noteId)
  };
  const details = (noteId) => {
    router.push({
      pathname: `/notes/write`,
      params: {
        id: noteId,
      },
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerStyle: {},
          headerShadowVisible: true,
          headerLeft: () => (
            <Text style={{ fontSize: 22, fontWeight: "600", paddingHorizontal: 20 }}>
              {" "}
              Notes
            </Text>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("/notes/write")}>
              <View style={{ marginRight: 10, marginBottom: 7 }}>
                {/* Add your icon here */}
              </View>
            </TouchableOpacity>
          ),
          headerTitle: "",
          headerTintColor: "black",
        }}
      />
        <View style={{ marginTop: 10, padding: 5 }}>
        <FlatList
          data={notes}
          keyExtractor={(note) => (note.id ? note.id.toString() : note.title)}
          renderItem={({ item }) => ( 
            <NoteListItem
              note={item}  
              user={user}
              details={() => details(item.id)}
              onDelete={() => handleDeleteNote(item.id)}  
              swipeableRefs={swipeableRefs}
            />
           )}
              />
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  notesItem: {
    padding: 10,
    backgroundColor: "whitesmoke",
    borderRadius: 15,
    marginBottom: 5,
  },
  title: {
    paddingVertical: 5,
    fontSize: 18,
    fontWeight: "400",
  },
  date: {
    color: "grey",
  },
  imageContainer: {
    flexDirection: "row",
    marginVertical: 5,
    gap: 2,
    display: "none",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  deleteButtonContainer: {
    flexDirection: "row",
    gap:15,
  },

  deleteButton: {
    backgroundColor: '#EFEFEF',
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    borderRadius:15,
    marginBottom:5,
    marginLeft: 10,


  },

});

export default App;