import React, { useContext, useEffect, useState,useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions,ActivityIndicator } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import CircularProgressBar from '../sharedlist/circularProgress';
import ProfileImage from '../common/Image';
import { useUser } from '../../context/userContext';
import I18nContext from '../../context/i18nProvider';
import AsyncStorageService from '../../services/asyncStorage';
import { useFocusEffect } from '@react-navigation/native';
import { useRefresh } from '../../context/refreshContext';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { API_BASE_URL } from '../../appConstants';
import Icon from 'react-native-vector-icons/FontAwesome';
const HabitSummary = ({user, summaryData,i18n })=>{
  return (
    <View>
        <Text style={{ marginBottom: 15, fontSize: 18 }}>{i18n.t('home.todayActivity')}</Text>
    <View style={{flexDirection:'row',alignItems:'flex-start',gap:10,}}> 
    <View style={{flex:1,backgroundColor:'white',justifyContent:'center',padding:10,borderRadius:10}}>
      <View style={{flexDirection:'row',alignItems:'center',gap:3,marginBottom:10,justifyContent:'center',padding:5,backgroundColor:'white'}}>
          <ProfileImage
                mainImageUri={user.profile_pic}
                width={30}
                height={30}
                name={user.name}
              />
          <Text style={{fontSize:16,alignItems:'center'}}> {user.name}</Text>
      </View>

      <View>
        <View >
        <CircularProgressBar percentage={calculatePercentage(summaryData.partner1.habits.total_done, summaryData.partner1.habits.total_habits)} tintColor={'#c5bef9'} radius={30} />
        </View> 
        <View>
          <Text style={{fontSize:14,marginTop:15,textAlign:'center'}}>{summaryData.partner1.habits.total_done} / {summaryData.partner1.habits.total_habits} {i18n.t('home.habitSummary.habitDone')}</Text>
        </View>
      </View>
      </View>
    
      <View style={{flex:1,backgroundColor:'white',justifyContent:'center',padding:10,borderRadius:10}}>
        {user.hasTeam ? (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 10, justifyContent: 'center', padding: 5, backgroundColor: 'white', alignItems: 'center' }}>
              <ProfileImage
                width={30}
                height={30}
                name={summaryData.partner2.habits.name}
              />
              <Text style={{ fontSize: 16, alignItems: 'center' }}> {summaryData.partner2.habits.name} </Text>
          </View>
            <View>
              <View style={{}}>
                <CircularProgressBar percentage={calculatePercentage(summaryData.partner2.habits.total_done, summaryData.partner2.habits.total_habits)} tintColor={'#c5bef9'} radius={30} />
              </View>
              <View>
              <Text style={{fontSize:14,marginTop:15,textAlign:'center'}}>{summaryData.partner2.habits.total_done} / {summaryData.partner2.habits.total_habits} {i18n.t('home.habitSummary.habitDone')}</Text>
              </View>
          </View>
        </View>
        ) : (
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 10, justifyContent: 'center', padding: 5, backgroundColor: 'white', alignItems: 'center' }}>
              <ProfileImage
                width={30}
                height={30}
                name={i18n.t('home.habitSummary.partner')}
              />
              <Text style={{ fontSize: 16, alignItems: 'center' }}> {i18n.t('home.habitSummary.partner')} </Text>
            </View>

            <View>
              <View style={{}}>
                <ProfileImage
                width={65}
                height={65}
                name={i18n.t('home.habitSummary.partner')}
              />
              </View>
              <View>
                <TouchableOpacity onPress={ () => {router.push('partnershare')}}> 
                <Text style={{ fontSize: 16, marginTop: 15, textAlign: 'center' }}> {i18n.t('home.habitSummary.invitePartner')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>  )}
      </View>


    </View>
    </View>
  )
};

const ListSummary = ({ user, summaryData,i18n }) => {
    return (
    <View>
      <Text style={{ marginBottom: 15, fontSize: 18 }}>{i18n.t('home.todayActivity')}</Text>
        <View style={{backgroundColor:'white',borderRadius:5}}>
      <View style={styles.container}>
      <View style={styles.summaryItemContainer}>
        <Text style={styles.summaryItemLabel}>{i18n.t('home.listSummary.listDone')}</Text>
        <View style={styles.summaryItemContent}>
          <Text style={styles.summaryItemValue}>{summaryData.partner1.list.num_completed}</Text>
          <View style={styles.summaryItemIconContainer}>
            <Icon name="check" size={20} color="#27AE60" />
          </View>
          <Text style={styles.summaryItemValue}>{summaryData.partner2.list ? summaryData.partner2.list.num_completed : '-'}</Text>
        </View>
      </View>


      <View style={styles.summaryItemContainer}>
        <Text style={styles.summaryItemLabel}>{i18n.t('home.listSummary.due')}</Text>
        <View style={styles.summaryItemContent}>
          <Text style={styles.summaryItemValue}>{summaryData.partner1.list.num_past_dateline}</Text>
          <View style={styles.summaryItemIconContainer}>
            <Icon name="clock-o" size={20} color="#E74C3C" />
          </View>
          <Text style={styles.summaryItemValue}>{summaryData.partner2.list ? summaryData.partner2.list.num_past_dateline : '-'}</Text>
        </View>
      </View>

      <View style={styles.summaryItemContainer}>
        <Text style={styles.summaryItemLabel}>{i18n.t('home.listSummary.listCount')}</Text>
        <View style={styles.summaryItemContent}>
          <Text style={styles.summaryItemValue}>{summaryData.partner1.list.total}</Text>
          <View style={styles.summaryItemIconContainer}>
            <Icon name="list" size={20} color="#3498DB" />
          </View>
          <Text style={styles.summaryItemValue}>{summaryData.partner2.list ? summaryData.partner2.list.total : '-'}</Text>
        </View>
      </View>
    </View>

    </View>
      </View>

  );
};



const data = [
  { id: '1', component: <HabitSummary /> },
  { id: '2', component: <ListSummary /> },
];

const calculatePercentage = (done, total) => {
  const percentage = (done / total) * 100;
  if (total === 0) {
    return 0;
  }
  return Math.round(percentage);
};


const YourCarouselComponent = ({  user }) => {
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state
  const [activeSlide, setActiveSlide] = useState(0);
  const {refresh,setRefresh} = useRefresh()
  const { i18n } = useContext(I18nContext);
 
  const fetchData = async () => {
    try {
      const token = await AsyncStorageService.getItem('token');
      if (token) {
        const response = await fetch(`${API_BASE_URL}/habitsummary/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        const data = await response.json();
        setSummaryData(data);
        setLoading(false); // Set loading to false after data is fetched
      }
    } catch (error) {
      console.error('Error fetching user profile:', error.message);
      setLoading(false); // Set loading to false in case of an error
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (refresh.refreshSummary) {
        fetchData();
        setRefresh({ refreshHabits: false, refreshList: false,refreshSummary:false,refreshNotes:false });
      }
    }, [refresh.refreshSummary])
  );

  if (loading) {
    // Render loading state
    return<ActivityIndicator size='medium' color={'grey'} />
    ;
  }


  const renderItem = ({ item }) => (
    <View style={[styles.item, {  backgroundColor: '#efedfd' }]}>
    
      {React.cloneElement(item.component, { user, summaryData ,i18n})} 
    </View>
  );
  
  return (
<View  style={{marginTop:5}}>
      <Carousel
        data={data}
        renderItem={renderItem}
        sliderWidth={Dimensions.get('window').width} // Set to 100% width
        itemWidth={Dimensions.get('window').width } // Adjusted item width as a percentage
        onSnapToItem={(index) => setActiveSlide(index)} // For Pagination
      />

      <Pagination
        dotsLength={data.length}
        activeDotIndex={activeSlide}
        containerStyle={styles.paginationContainer}
        dotStyle={styles.dotStyle}
        inactiveDotStyle={styles.inactiveDotStyle}
        inactiveDotOpacity={0.6}
        inactiveDotScale={0.8}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'lightblue',
    borderRadius: 5,
    paddingVertical: 15,
    padding: 10,

    marginBottom: 30,
    marginTop: 10,
    borderRadius: 10,
    width:'92%',
    flex:1,
    justifyContent:'center'
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    paddingVertical: 10,
  },
  dotStyle: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: 'grey',
    marginHorizontal: 1,
  },
  inactiveDotStyle: {
    width: 6,
    height: 6,
    borderRadius: 5,
    backgroundColor: '#D8D8D8',
    marginHorizontal: 1,
  },
  container:{
    marginTop:10
  },
  summaryItemContainer: {
    marginBottom: 5,
  },
  summaryItemLabel: {
    textAlign: 'center',
    marginBottom: 5,
    color: 'grey',
    fontSize: 12,
  },
  summaryItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 5,
    flex: 1,
    borderBottomWidth:2,
    borderColor:'whitesmoke'
  },
  summaryItemValue: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
  },
  summaryItemIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
});

export default YourCarouselComponent;
