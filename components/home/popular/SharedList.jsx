import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, ImageBackground } from 'react-native';
import { COLORS } from '../../../constants';
import { useRouter } from 'expo-router';
import { useUser } from '../../../context/userContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorageService from '../../../services/asyncStorage';
import { Alert } from 'react-native';
import AddSharedListModal from '../../sharedlist/CollectiveListModal';
import { useFocusEffect } from '@react-navigation/native';
import { useRefresh } from '../../../context/refreshContext';
import I18nContext from '../../../context/i18nProvider';
import { API_BASE_URL,colorOptions } from '../../../appConstants';
import MyHabitIcon from '../../Habits/habitIcon';

const SharedLists = () => {
  const { user } = useUser();
  const { refresh, setRefresh } = useRefresh();
  const { i18n } = useContext(I18nContext);

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [isLongPress, setLongPress] = useState(false);
  const userHasTeam = user.hasTeam;
  const router = useRouter();

  const [newSharedList, setNewSharedList] = useState({
    title: '',
    color: '#f7b4a3',
    description: '',
    user: user.id,
    shareList: user.hasTeam,
  });

  useEffect(() => {
    fetchData();
  }, [user.id]);

  useFocusEffect(
    useCallback(() => {
      if (refresh.refreshList) {
        fetchData();
        setRefresh({ refreshHabits: false, refreshList: false, refreshSummary: false ,refreshNotes:false});
      }
    }, [refresh.refreshList])
  );

  const fetchData = async () => {
    const token = await AsyncStorageService.getItem('token');
    try {
      const allListUrl = `${API_BASE_URL}/collaborative-lists/`;
      const response = await fetch(allListUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });
      const data = await response.json();
        setData(data);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const handleEditPress = (item) => {
    console.log('Edit button pressed for item:', item);
  };

  const handleItemPress = (item) => {
    router.push({
      pathname: `/sharedlist/id`,
      params: {
        id: item.id,
        color: item.color,
        name: item.title,
        user: user.id,
        donecount: item.done_item_count ?? 0,
        listitemcount: item.listitem_count ?? 1,
        description: item.description,
        hasTeam: user.hasTeam,
        dateline:item.dateline || ''
      },
    });
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleAddButtonClick = () => {
    setShowAddModal(true);
  };

  const handleLongPress = (item) => {
    setLongPress(true);
  };

  const handleDeletePress = (item) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            setLongPress(false);
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{i18n.t('home.shareListTitle')}</Text>
        <TouchableOpacity onPress={handleAddButtonClick}>
          <MyHabitIcon size={30} iconName={'plus-circle-outline'} colorValue={'black'}/>
        </TouchableOpacity>
      </View>
      <View style={styles.cardsContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : error ? (
          <Text>{error}</Text>
        ) : (
          <FlatList
            data={data}
            renderItem={({ item, index }) => (
              <View >
                <TouchableOpacity
                  onPress={() => {handleItemPress(item)}}
                  delayLongPress={2000}>
                  <ImageBackground
                    //source={{ uri: theme[index]}} 
                    style={[styles.card,{backgroundColor:item.color} ]}
                    imageStyle={{ 
                      borderRadius: 20,
                      borderTopLeftRadius: 7,
                      borderBottomLeftRadius: 7,
                    }}
                    >
                    <View
                      style={{
                        padding: 10,
                        width: 50,
                        height: 50,
                        backgroundColor: 'white',

                        borderRadius: 25,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {item.has_team ? (
                        <View style={styles.cardUser}>
                          <Text>{item.member1_name.charAt(0).toUpperCase()}</Text>
                          <Text>|</Text>
                          <Text>{item.member2_name.charAt(0).toUpperCase()}</Text>
                        </View>
                      ) : (
                        <View style={styles.cardUser}>
                          <Icon name="lock" size={18} style={{ color: 'grey' }} />
                        </View>
                      )}
                    </View>
                  </ImageBackground>

                </TouchableOpacity>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {' '}
                  {item.title}
                </Text>


              </View>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>
      {/* Modal for Add Shared List */}
      <AddSharedListModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        callBack={fetchData}
        userHasTeam={userHasTeam}
        updateList={fetchData}
      />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop:10,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    alignItems: 'center',
  },
  cardsContainer: {
    marginBottom: 10,
    height: 300,
    
  },
  card: {
    backgroundColor: COLORS.white,
    marginRight: 10,
    borderRadius: 20,
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    width: 170,
    height: 240,
    flexDirection: 'column',    
  },

  cardText: {
    fontSize: 14,
    color: 'grey',
  },
  cardTitle: {
    fontSize: 16,
    paddingTop: 3,
    width: 170,
    color:'grey'
  },
  cardUser: {
    flexDirection: 'row',
    gap: 5,
    marginVertical: 5,
    alignItems: 'center',
  },
};
export default SharedLists;
