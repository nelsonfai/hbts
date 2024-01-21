import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  View,
  ActivityIndicator,
  Animated,
  FlatList,
  Alert,
  RefreshControl,
} from "react-native";
import AsyncStorageService from "../../services/asyncStorage";
import { API_BASE_URL } from "../../appConstants";
import { COLORS } from "../../constants";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter, Stack } from "expo-router";
import { useRefresh } from "../../context/refreshContext";
import { useFocusEffect } from "expo-router";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useSwipeable } from "../../context/swipeableContext";
import MyHabitIcon from "../../components/Habits/habitIcon";
import TagColorModal from "../../components/notes/NoteTags";
import { useUser } from "../../context/userContext";
import NetInfo from "@react-native-community/netinfo";
import NetworkStatus from "../../components/NetworkStatus";
import EmptyNotesPage from "../../components/emptyPage";
const DELETE_ICON = "trash";
const EDIT_ICON = "edit";

const NoteListItem = ({ note, onDelete, onEdit, onDetails, swipeableRefs }) => {
  const formattedDate = new Date(note.date).toLocaleDateString();
  const swipeableRef = useRef(null);
  const { openRowId, setOpenRowId } = useSwipeable({
    listOpenId: null,
    habitOpenid: null,
    noteOpenid: null,
  });

  useEffect(() => {
    swipeableRefs[note.id] = swipeableRef.current;
    return () => {
      swipeableRefs[note.id] = null;
    };
  }, [note.id, swipeableRefs]);

  const closeCurrent = (index) => {
    if (index) {
      swipeableRefs[index].close();
      setOpenRowId((prevOpenRowId) => ({
        ...prevOpenRowId,
        noteOpenid: null,
        listOpenId: null,
        habitOpenid: null,
      }));
    }
  };

  const handleSwipeOpen = (index) => {
    if (openRowId?.noteOpenid !== null && openRowId?.noteOpenid !== index) {
      const prevRef = swipeableRefs[openRowId?.noteOpenid];
      if (prevRef) {
        prevRef.close();
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
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            onDelete(note.id);
          }}
        >
          <View style={[styles.actionButton]}>
            <Icon name={DELETE_ICON} size={25} color="grey" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            onEdit(note.id, note.color);
            closeCurrent(note.id);
          }}
        >
          <View style={[styles.actionButton]}>
            <Icon name={EDIT_ICON} size={25} color="grey" />
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
      onSwipeableWillOpen={() => {
        handleSwipeOpen(note.id);
      }}
    >
      <TouchableOpacity onPress={onDetails}>
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
            <View style={styles.dateContainer}>
              {!note.team ? (
                <Icon name="lock" size={18} color={"grey"} />
              ) : null}
              <View
                style={{
                  width: 15,
                  height: 15,
                  borderRadius: 8,
                  backgroundColor: note.color,
                }}
              ></View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const NotesScreen = () => {
  const { user } = useUser();
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { refresh, setRefresh } = useRefresh();
  const [visible, setVisible] = useState(false);
  const [tagcolor, setTagColor] = useState("");
  const [isShared, setIsShared] = useState(false);
  const [id, setId] = useState();
  const userHasTeam = user.hasTeam;
  const teamId = user.team_id;
  const swipeableRefs = {};
  const [network, SetNetWork] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const networkCheck = () => {
    console.log("checked ");
    NetInfo.fetch().then((state) => {
      SetNetWork(state.isConnected);
    });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotes().then(() => setRefreshing(false));
  }, [refresh, setRefresh]);

  const fetchNotes = async () => {
    networkCheck();
    if (network) {
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
        }
      } catch (error) {
        //console.error("Error fetching notes:", error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [network]);

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

  const handleDeleteNote = async (noteId) => {
    console.log("Note Deleted", noteId);
    try {
      const token = await AsyncStorageService.getItem("token");
      console.log(token);
      const apiUrl = `${API_BASE_URL}/notes/${noteId}/`;

      const requestOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      };

      const response = await fetch(apiUrl, requestOptions);

      if (response.ok) {
        console.log("Note deleted successfully");
        fetchNotes();
      } else {
        const errorData = await response.json();
        //console.error("Error deleting note:", errorData);
        if (errorData.error === "Permission denied") {
          Alert.alert("Permission Denied");
        }
      }
    } catch (error) {
      console.error("Error deleting note:", error.message);
    }
  };

  const handleEditNote = (noteId, noteColor, hasTeam) => {
    console.log("Note Edited", noteId);
    setVisible(true);
    setTagColor(noteColor);
    setId(noteId);
    const is_shared = hasTeam ? true : false;
    setIsShared(is_shared);
    console.log(tagcolor);
  };

  const details = (noteId, color, title) => {
    router.push({
      pathname: `/notes/write`,
      params: {
        id: noteId,
        color: color,
        title: title,
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
                <MyHabitIcon size={35} iconName={"plus-circle-outline"} color={"grey"} />
              </View>
            </TouchableOpacity>
          ),
          headerTitle: "",
          headerTintColor: "black",
        }}
      />
      {network ? (
        <View style={{ marginTop: 10, padding: 5 }}>
        {notes.length === 0 ? (

            <EmptyNotesPage title={'note'} image={'list'}/>       
        ) : (
          <FlatList
            data={notes}
            keyExtractor={(note) => (note.id ? note.id.toString() : note.title)}
            renderItem={({ item }) => (
              <NoteListItem
                note={item}
                onDelete={() => handleDeleteNote(item.id)}
                onEdit={() => handleEditNote(item.id, item.color, item.team)}
                onDetails={() => details(item.id, item.color ? item.color : "black", item.title)}
                swipeableRefs={swipeableRefs}
              />
            )}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
        )}
      </View>
      ) : (
        <NetworkStatus onRefresh={fetchNotes} />
      )}
      <TagColorModal
        visible={visible}
        teamId={teamId}
        noteId={id}
        onClose={() => setVisible(false)}
        refreshNotes={() =>
          setRefresh({
            refreshHabits: false,
            refreshList: false,
            refreshSummary: false,
            refreshNotes: true,
          })
        }
        setColor={tagcolor}
        userHasTeam={userHasTeam}
        ini_shared={isShared}
      />
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
    fontSize: 18,
    marginBottom: 10,
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
    gap: 15,
  },

  deleteButton: {
    backgroundColor: "#EFEFEF",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    borderRadius: 15,
    marginBottom: 5,
    marginLeft: 10,
  },
});

export default NotesScreen;
