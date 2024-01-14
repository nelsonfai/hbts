import React, { useState, useEffect, useRef, useCallback,useContext } from "react";
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { Stack, useRouter } from "expo-router";
import { COLORS } from "../../constants";
import AsyncStorageService from "../../services/asyncStorage";
import { useUser } from "../../context/userContext";
import { Swipeable } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/FontAwesome';
import CalendarStrip from 'react-native-calendar-strip';
import { useFocusEffect } from "expo-router";
import { useRefresh } from "../../context/refreshContext";
import { useSwipeable } from "../../context/swipeableContext";
import SubscriptionModal from "../../components/subscription/SubcritionModal";
import MyHabitIcon from "../../components/Habits/habitIcon";
import I18nContext from "../../context/i18nProvider";
import { API_BASE_URL } from "../../appConstants";

const Habits = () => {
  const { user } = useUser();
  const {i18n,locale} = useContext(I18nContext)
  const swipeableRefs = {};
  const [subscribeModal ,setSubscribeModal] = useState(false)
  const {openRowId, setOpenRowId } = useSwipeable({
    listOpenId:null,
    habitOpenid:null,
    noteOpenid:null
  })

  const { refresh, setRefresh } = useRefresh();
  const router = useRouter();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentDate = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(currentDate);
  const [dateText, setDateText] = useState(i18n.t('habits.today'));


  const fetchHabits = async () => {
    try {
      const token = await AsyncStorageService.getItem("token");
      const response = await fetch(`${API_BASE_URL}/habits/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          target_date: date,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch habits");
      }

      const data = await response.json();
      setHabits(data.habits);
    } catch (error) {
      console.error("Error fetching habits:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [date]);

  useFocusEffect(
    useCallback(() => {
      if (refresh.refreshHabits) {
        fetchHabits();
        setRefresh((prevRefresh) => ({
          ...prevRefresh,
          refreshHabits: false,
        }));

      }
    }, [refresh.refreshHabits])
  );

  const handleDateSelected = (selectedDate) => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    setDate(formattedDate);
    if (formattedDate === currentDate) {
        setDateText(i18n.t('habits.today'));
    } else {
        const displayOptions = { month: 'short', year: 'numeric' };
        const translatedDate = new Date(selectedDate).toLocaleDateString(locale, displayOptions);
        setDateText(translatedDate);
    }
};

  function formatDate(inputDate) {

    const options = { month: 'short', year: 'numeric' };
    const translateDate = new Date(inputDate).toLocaleDateString(locale, options);
  }
  const AddHabit = () => {
    router.push({
      pathname: `/AddHabit`,
      params: {
        mood: 'create'
      }

    });
  };

  const UpdateHabit = (habit) => {
    const router = useRouter();
    currentSwipeable(habit.habit.id)

    let hasReminderVal;
    if (habit.habit.reminder_time) {
      hasReminderVal = true
    }
    else {
      hasReminderVal = false
    }
    router.push({
      pathname: `/AddHabit`,
      params: {
        id: habit.habit.id,
        hasReminder: hasReminderVal,
        color: habit.habit.color,
        name: habit.habit.name,
        description: habit.habit.description || '',
        start_date: habit.habit.start_date,
        end_date: habit.habit.end_date || '',
        reminder_time: habit.habit.reminder_time || '',
        specific_days_of_week: habit.habit.specific_days_of_week ? habit.habit.specific_days_of_week.split(',') : [],
        frequency: habit.habit.frequency,
        isshared: habit.habit.isShared,
        mood: 'update',
        habitIcon: habit.habit.icon || '',

      },
    });
  };
  const handleDelete = async (habitId) => {
    try {
      // Show confirmation alert
      Alert.alert(
        i18n.t('habits.deleteHabit.confirmDelete'),
        i18n.t('habits.deleteHabit.deleteText'),
        [
          {
            text:i18n.t('habits.deleteHabit.cancelButton'),
            style: "cancel",
          },
          {
            text:i18n.t('habits.deleteHabit.deleteButton'),
            onPress: async () => {
              const token = await AsyncStorageService.getItem("token");
              const response = await fetch(
                `${API_BASE_URL}/habits/${habitId}/delete/`,
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                  },
                }
              );

              if (!response.ok) {
                throw new Error("Failed to delete habit");
              }

              // Refresh habits after deletion
              setRefresh({ refreshHabits: false, refreshList: false, refreshSummary: true,refreshNotes:false });
              fetchHabits();
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error deleting habit:", error.message);
    }
  };


  const handleMarkAsDone = async (habitId) => {
    try {
      const currentDate = new Date();
      const selectedDate = new Date(date);
      // Check if the selected date is later than today
      if (selectedDate > currentDate) {
        // Show an alert
        Alert.alert(i18n.t('habits.dateFuture'));
        return;
      }
      const token = await AsyncStorageService.getItem('token');
      const response = await fetch(`${API_BASE_URL}/habits/${habitId}/mark-as-done/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          date: date, // Include the date in the request body
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark habit as done");
      }

      currentSwipeable(habitId)

      setRefresh({ refreshHabits: false, refreshList: false, refreshSummary: true,refreshNotes:false });
      fetchHabits();
    } catch (error) {
      console.error("Error marking habit as done:", error.message);
    }
  };

  const currentSwipeable = (index) =>{
    if (swipeableRefs[index]) {
      swipeableRefs[index].close();
      }}

  const handleSwipeOpen = (index) => {
    if (openRowId?.habitOpenid !== null && openRowId?.habitOpenid !== index) {
      swipeableRefs[openRowId?.habitOpenid]?.close();
    }
    setOpenRowId({noteOpenid:null, listOpenId: null, habitOpenid: index });
  };
  const handleSwipeClose = () => {
    setOpenRowId({noteOpenid:null, listOpenId: null, habitOpenid: null });
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerLeft: () => (
            <Text style={{fontSize:22,fontWeight:'600',paddingHorizontal:20}}> {dateText}</Text>
          ),
          headerRight: () => (
            <TouchableOpacity style={{ marginRight: 10,marginBottom:7 }} 
            onPress={user.premium ? AddHabit : () => setSubscribeModal(true)}>
              <MyHabitIcon size={35} iconName={'plus-circle-outline'} color={'grey'}/>
            </TouchableOpacity>
          ),
          headerTitle: '',
        }}
      />
      <View style={{ padding:5}}>
        <CalendarStrip
          showMonth	={false}
          startingDate={date}
          selectedDate={currentDate}
          onDateSelected={handleDateSelected}
          style={{ height: 60,padding:10 }}
          calendarAnimation={{ type: 'sequence', duration: 20 }}
          scrollable={true}
          daySelectionAnimation={{ type: 'background', highlightColor	: 'black' }}
          highlightDateNumberStyle={{color: 'white'}}
          highlightDateNameStyle={{color: 'white'}}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {loading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: 'center' }}>
            <ActivityIndicator size="medium" color="grey" />
          </View>
        ) : (
          
            habits.map((habit, index) => (
              <Swipeable
                key={habit.id}
                ref={(ref) => swipeableRefs[habit.id] = ref} 
                onSwipeableWillOpen={() => {
                  handleSwipeOpen(habit.id)
                }}
                renderRightActions={() => (
                  <View style={{ flexDirection: 'row' }}>
                                              <TouchableOpacity
                            onPress={() => handleMarkAsDone(habit.id)}>
                            <View style={styles.swipeButton}>
                              {!habit.done ? (
                                <Icon name="check" size={20} color={'grey'} />
                              ) : (
                                <Icon name="times" size={20} color={'grey'} />
                              )}
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => handleDelete(habit.id)}>
                            <View style={styles.swipeButton}>
                              <Icon name="trash" size={25} color={'grey'} />
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => UpdateHabit({ habit })}>
                            <View style={styles.swipeButton}>
                              <Icon name="edit" size={24} color='grey' />
                            </View>
                          </TouchableOpacity>
                                          </View>
                )}
                //onSwipeableWillOpen={() => handleSwipeOpen(habit.id, index)}

              >
                <TouchableOpacity
                  style={[styles.habitItem, { backgroundColor: habit.done ? habit.color : 'whitesmoke', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }]}
                  onPress={() => {
                    router.push({
                      pathname: '/habitstats',
                      params: {
                        habitId: habit.id,
                        name: habit.name || '',
                        color: habit.color || '',
                      },
                    });
                  }}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', gap: 7, alignItems: 'flex-start' }}>
                      <MyHabitIcon iconName={habit.icon} size={25} />
                      <View>
                        <Text style={styles.habitName}>{habit.name}</Text>
                        <Text style={styles.habitDescription}>{habit.description.toLowerCase()}</Text>
                        <Text style={{fontWeight:300}}> {habit.partner_done_count} | {habit.partner_count}</Text>
                      </View>
                  </View>
                  
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 3, }}>
                    <Text style={{ fontSize: 14 }}>
                    {habit.streak}
                  </Text>
                    <Icon name="fire" size={11} color={'red'} />
                  </View>

                </TouchableOpacity>
              </Swipeable>
            ))
        )}
        <SubscriptionModal isVisible={subscribeModal} onClose={()=> setSubscribeModal(false)}/>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginTop: 10,
  },
  habitItem: {
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    gap: 10
  },
  habitName: {
    paddingVertical: 5,
    fontSize: 18,
    fontWeight: '400',
  },
  habitDescription: {
    fontSize: 14,
    marginVertical: 3,
    flex: 1,
  },
  swipeButton: {
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
    width: 60
  },
});

export default Habits;