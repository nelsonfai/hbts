import React, { useEffect, useState, useCallback, useRef ,useContext} from "react";
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
import I18nContext from "../../context/i18nProvider";
const DELETE_ICON = "trash";
const EDIT_ICON = "edit";
import SubscriptionModal from "../../components/subscription/SubcritionModal";
import fetchPermission from "../../services/userinfo";

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
        <View style={[styles.notesItem,{backgroundColor:`${note.color}`}]}>
          <Text style={styles.title} numberOfLines={1}>
            {note.title}
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={styles.dateContainer}>
              <Icon name="calendar" size={16} color={"black"} />
              <Text style={styles.date}>{formattedDate}</Text>
            </View>
            <View style={styles.dateContainer}>
              {!note.team ? (
                <Icon name="lock" size={16} color={"black"} />
              ) : <Icon name="link" size={16} color={"black"} />}

            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const NotesScreen = () => {
  const { user,setUser } = useUser();
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [limit, setLimit] = useState([]);
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
  const {i18n,locale} = useContext(I18nContext)
  const [subscribeModal ,setSubscribeModal] = useState(false)


  const networkCheck = () => {
    console.log("checked ");
    NetInfo.fetch().then((state) => {
      SetNetWork(state.isConnected);
    });
  };
  const createNotes = async () => {
    try {
      const  isPremium = await fetchPermission(setUser);
      if (!isPremium && limit) {
        setSubscribeModal(true);
      } else {
        router.push("/notes/write") 
      }
    } catch (error) {
      //('Error fetching user permissions:', error);
    }
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
          setNotes(data.data);
          setLimit(data.limitreached)
        } else {
          const errorData = await response.json();
        }
      } catch (error) {
        //("Error fetching notes:", error.message);
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
        ////("Error deleting note:", errorData);
        if (errorData.error === "Permission denied") {
          Alert.alert("Permission Denied");
        }
      }
    } catch (error) {
      //("Error deleting note:", error.message);
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
              {i18n.t('notes.notes')}
            </Text>
          ),
          headerRight: () => (
          <TouchableOpacity onPress={createNotes}>
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
        {notes.length === 0 && !loading  ? (

            <EmptyNotesPage title={i18n.t('notes.noNote')} image={'list'} subtext ={i18n.t('notes.addNote')}/>       
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
        <SubscriptionModal isVisible={subscribeModal} onClose={() => setSubscribeModal(false)}  info={i18n.t('notes.notesInfo')}/>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
    paddingHorizontal: 5,
    paddingTop: 10,
  },
  notesItem: {
    padding: 15,
    backgroundColor: "whitesmoke",
    borderRadius: 15,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "400",
  },
  date: {
    color: "black",
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
