import React, { useState, useEffect,useContext } from "react";
import { SafeAreaView, ScrollView, View, Text, StyleSheet,TouchableOpacity,ActivityIndicator,useWindowDimensions} from "react-native";
import ProfileImage from "../../components/common/Image";
import { COLORS } from "../../constants";
import { useLocalSearchParams,Stack } from "expo-router";
import AsyncStorageService from "../../services/asyncStorage";
import { Calendar, DotMarking, } from "react-native-calendars";
import { useRouter } from "expo-router";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryGroup, VictoryLabel,} from 'victory-native';
import NetworkStatus from "../../components/NetworkStatus";
import NetInfo from "@react-native-community/netinfo";

import I18nContext from "../../context/i18nProvider";
const HabitStats = ({ route }) => {
  const params = useLocalSearchParams();
  const router = useRouter()
  const {i18n} = useContext(I18nContext)
  const { width: screenWidth } = useWindowDimensions(); 

  const [partner1Stats, setPartner1Stats] = useState(null);
  const [p1Percentage,setP1Percentage] = useState('-')
  const [p2Percentage,setP2Percentage] = useState('-')
  const [p1Total,setP1Total] = useState('-')
  const [p2Total,setP2Total] = useState('-')


  const [rangetype,setRangetype] = useState('monthly')
  const [partner2Stats, setPartner2Stats] = useState(null);
  const [habitInfo, setHabitInfo] = useState(null);
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split("T")[0]
  );
  const habitId = params.habitId;
  

  const [network, SetNetWork] = useState(true);

  const networkCheck = () => {
    NetInfo.fetch().then((state) => {
      SetNetWork(state.isConnected);
    });
  };


  const fetchHabitStats = async () => {
    networkCheck()
    if (!network){
      return
    }
    try {
      const token = await AsyncStorageService.getItem("token");
      const fetchUrl = `https://cpj.onrender.com/api/habit/${habitId}/statistics/?start_date=${startDate}&end_date=${endDate}&rangetype=${rangetype}`;
      const response = await fetch(fetchUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch habit statistics");
      }
      const data = await response.json();

      setPartner1Stats(data.partner1);
      setPartner2Stats(data.partner2);
      setHabitInfo(data.habit_info);
      if (rangetype === 'yearly') {
        console.log('Yearly')
        const yearlyData = calculateYearlyData(data);
        setP1Total(yearlyData.partner1Total );
        setP2Total(yearlyData.partner2Total);
        setP1Percentage(yearlyData.partner1Percentage);
        setP2Percentage(yearlyData.partner2Percentage);
      }
    } catch (error) {
      ////("Error fetching habit statistics:", error.message);
    }
  };
  useEffect(() => {
    fetchHabitStats();
  }, [habitId, startDate]);

const chooseMonthly = () =>{
  setStartDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0])
  setEndDate(  new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split("T")[0])
  setRangetype('monthly')
}

const chooseYearly = () => {
  const currentYear = new Date().getFullYear();
  const startDate = `${currentYear}-01-01`;
  const endDate = `${currentYear}-12-31`;

  setStartDate(startDate);
  setEndDate(endDate);
  setRangetype('yearly');
};

const renderCalendarOrChart = () => {
  if (rangetype === 'monthly') {
    return (
      <View> 
      <Calendar
      theme={{
        arrowColor: 'grey',
      }}
        markingType="multi-period"
        markedDates={renderCalendarDots(partner1Stats.completed_days_list, partner2Stats.completed_days_list)}
        onMonthChange={(newMonth) => {
          const { year, month } = newMonth;
                  const calculatedStartDate = `${year}-${String(month).padStart(2, '0')}-01`;
  
          const lastDay = new Date(year, month, 0).getDate();
          const calculatedEndDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;
          setRangetype('monthly')
          setStartDate(calculatedStartDate);
          setEndDate(calculatedEndDate);
        }}
        />
        </View>
    );
  } else if (rangetype === 'yearly') {
    return (
    renderBarChart()
    )
  }

  return null;
};
const calculateYearlyData = (data) => {
  const partner1Data = data.partner1.completed_days_list;
  const partner2Data = data.partner2.completed_days_list;
  let partner2Total = 0
  let partner2Undone = 0
  if (partner2Data){
    partner2Total = partner2Data.reduce((total, entry) => total + entry.total_completed_days, 0);
    partner2Undone = partner2Data.reduce((total, entry) => total + entry.total_days, 0);

  }
  const partner1Total = partner1Data.reduce((total, entry) => total + entry.total_completed_days, 0);

  const partner1Undone = partner1Data.reduce((total, entry) => total + entry.total_days, 0);

  const partner1Percentage = calculateDonePercentage(partner1Total, partner1Undone);
  const partner2Percentage = partner2Total > 0 ? calculateDonePercentage(partner2Total, partner2Undone) : '-';

  return {
    partner1Total,
    partner2Total,
    partner1Percentage,
    partner2Percentage,
  };
};

const calculateMonthlyData = () => {
  const monthlyData = [];
  let partner1CompletedSum = 0;
  let partner2CompletedSum = 0;
  let partner1PercentageSum = 0;

  for (let i = 1; i <= 12; i++) {

    const partner1MonthData = partner1Stats.completed_days_list.find(entry => entry.month === i);
    let partner2PercentageValue = null
    if (partner2Stats.completed_days_list){
      const partner2MonthData = partner2Stats.completed_days_list.find(entry => entry.month === i);
      const partner2Completed = partner2MonthData ? partner2MonthData.total_completed_days : 0;
      const partner2Undone = partner2MonthData ? partner2MonthData.total_days : 0;
      const partner2Percentage = partner2Completed / partner2Undone || 0;
      partner2PercentageValue = Math.round(partner2Percentage *  100)
      partner2CompletedSum += partner2Completed;
    }

    const partner1Completed = partner1MonthData ? partner1MonthData.total_completed_days : 0;
    const partner1Undone = partner1MonthData ? partner1MonthData.total_days : 0;

    const partner1Percentage = partner1Completed /  partner1Undone || 0;
    partner1CompletedSum += partner1Completed;
    partner1CompletedSum += partner1Completed;


    const monthList = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    monthlyData.push({
      month: monthList[i],
      partner1Percentage: Math.round(partner1Percentage * 100),
      partner2Percentage: partner2PercentageValue,
    });
  }
  return monthlyData;
};

const renderBarChart = () => {
  const monthlyData = calculateMonthlyData();
  return (
    <VictoryChart theme={VictoryTheme.material} width={screenWidth} padding={{ top: 30, bottom: 30, right: 25, left: 25 }}>
      <VictoryAxis 
        style={{
          grid: { stroke: '#F4F5F7', strokeWidth: 0.5 },
        }}
      />
      <VictoryGroup offset={7}>
        <VictoryBar
          data={monthlyData.map(entry => ({ x: entry.month, y: entry.partner1Percentage }))}
          barWidth={5}
          labelComponent={<VictoryLabel dy={0}/>}
          style={{
            data: {
              fill: params.color,
            },
          }}
          />
        <VictoryBar
          data={monthlyData.map(entry => ({ x: entry.month, y: entry.partner2Percentage }))}
          barWidth={5}
          labelComponent={<VictoryLabel dy={0}/>}
          style={{
            data: {
              fill: '#ccc'
            },
          }}
                  />
      </VictoryGroup>
    </VictoryChart>
  );
  
  
};

  const calculateDonePercentage = (completed, totalDays) => {
    if (totalDays === 0) {
      return 0;
    }
    if (isNaN(totalDays)){
      return '-';
    }
    return Math.round((completed / totalDays) * 100) + '%';
  };

  const doneSlashNot = (done, completed) => {
    const totalDays = completed ;

    if (isNaN(totalDays)){
      return '-';
    }
    return  `${done}/${totalDays}`;
  };

  const renderCalendarDots = (partner1CompletedDays, partner2CompletedDays) => {
    const dotMarkings = {};
    if (partner1CompletedDays) {
      partner1CompletedDays.forEach((completedDay) => {
        dotMarkings[completedDay] = dotMarkings[completedDay] || {};
        dotMarkings[completedDay].periods = dotMarkings[completedDay].periods || [];
        dotMarkings[completedDay].periods.push({
          color: params.color, 
          startingDay: false,
          endingDay: true,
        });
      });
    }
  
    if (partner2CompletedDays) {
      partner2CompletedDays.forEach((completedDay) => {
        dotMarkings[completedDay] = dotMarkings[completedDay] || {};
        dotMarkings[completedDay].periods = dotMarkings[completedDay].periods || [];
        dotMarkings[completedDay].periods.push({
          color: '#ccc', 
          startingDay: false,
          endingDay: false,
        });
      });
    }
    return dotMarkings;
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
          <Stack.Screen
        options={{
          headerStyle: { backgroundColor: params.color || COLORS.lightWhite },
          headerShadowVisible: false,
          headerTitleAlign: 'center',

          headerTintColor: 'black', 
          headerTitleStyle: {
            alignSelf: 'center',
          },
          headerTitle:params.name,
        }}
      />
  {network ?    (<ScrollView  showsVerticalScrollIndicator={false}>
        {partner1Stats && partner2Stats && habitInfo ? (
          <View>
            <View style={styles.topContainer}>
              <View style={styles.partnerContainer}>
                <ProfileImage  mainImageUri ={partner1Stats.profile} width= {60} height = {60} />
                <Text style={styles.name}>{partner1Stats.user_name}</Text>
              </View>
              <View style={[styles.addSignContainer,{backgroundColor: params.color, }]}>
                <Text style={[styles.addSign]}>&</Text>
              </View>
              {partner2Stats && partner2Stats.user_id ? (
                  <View style={styles.partnerContainer}>
                    <ProfileImage  mainImageUri ={partner2Stats.profile} name={partner2Stats.user_name} width={60} height={60} />
                    <Text style={styles.name}>{partner2Stats.user_name}</Text>
                  </View>
                ) : (
                  <View style={styles.partnerContainer}>
                    <ProfileImage  name={'Partner'} width={50} height={50} />
                    <TouchableOpacity
                                  onPress={() => {
                                    router.push({
                                      pathname: '/partnershare', 

                                    });
                                  }}>
                    <TouchableOpacity onPress={ () => {router.push('partnershare')}}> 
                      <Text style={styles.name}> + {i18n.t('habitstats.invitePartner')}</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                  </View>
                )}
            </View>
            <View style={[styles.filterContainer,{borderColor:params.color}]}>
                <TouchableOpacity style={[styles.filterButtons,{backgroundColor: rangetype === 'monthly' ? params.color  : COLORS.lightWhite}]}onPress={chooseMonthly} >
                        <Text>{i18n.t('habitstats.monthly')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.filterButtons,{backgroundColor: rangetype === 'yearly' ? params.color  : COLORS.lightWhite}]} onPress={chooseYearly}>
                        <Text>{i18n.t('habitstats.thisyear')}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.calendarContainer}>
                      {renderCalendarOrChart()}
            </View>
            <View style={{marginTop:20}}>
            <View style={styles.dataContainer}>
                <Text style={styles.datatitle}> {i18n.t('habitstats.totalDaysCompleted')}</Text>
                <View style={styles.dataEntry}> 
                <View style={[styles.databox]}>

                 <Text style={styles.numbers}>
                      {rangetype === 'monthly'
                        ? doneSlashNot(partner1Stats.total_completed_days, partner1Stats.total_days)
                        : p1Total}
                  </Text>
                    </View>
                    <View style={[styles.databox]}>
                    <Text style={styles.numbers}>
                      {rangetype === 'monthly'
                        ? doneSlashNot(partner2Stats.total_completed_days,partner2Stats.total_days)
                        : p2Total}
                    </Text>

                    </View>
                </View>
            </View>
            <View style={styles.dataContainer}>
                <Text style={styles.datatitle}> {i18n.t('habitstats.donePercentage')}</Text>
                <View style={styles.dataEntry}> 
                <View style={[styles.databox]}>
                    <Text style={styles.numbers}>
                      {rangetype === 'monthly'
                        ? calculateDonePercentage(partner1Stats.total_completed_days, partner1Stats.total_days)
                        : p1Percentage}
                    </Text>
                    </View>
                    <View style={[styles.databox]}>
                    <Text style={styles.numbers}>
                      {rangetype === 'monthly'
                        ? calculateDonePercentage(partner2Stats.total_completed_days, partner2Stats.total_days)
                        : p2Percentage}
                    </Text>
                    </View>
                </View>
            </View>
            <View style={styles.dataContainer}>
                <Text style={styles.datatitle}> {i18n.t('habitstats.currentStreak')}</Text>
                <View style={styles.dataEntry}> 
                <View style={[styles.databox]}>
                    <Text style={styles.numbers}>
                    {partner1Stats.current_streak !== null && partner1Stats.current_streak !== undefined
                            ? partner1Stats.current_streak 
                            : '-'} </Text>
                    </View>
                    <View style={[styles.databox]}>
                    <Text style={styles.numbers}>
                    {partner2Stats.current_streak !== null && partner2Stats.current_streak !== undefined
                            ? partner2Stats.current_streak
                            : '-'} 
                    </Text>
                    </View>
                </View>
            </View>
            </View>
          </View>
  
        ) : (
          <View style={{flex:1,justifyContent:"center",alignItems:'center',padding:30}}>
              <ActivityIndicator size="medium" color="grey" />
          </View>

        )}
      </ScrollView>) : (<NetworkStatus  onRefresh={fetchHabitStats}/>)}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap:3,

  },
  partnerContainer: {
    padding: 20,
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'white',
    paddingVertical:50
  },
  dataContainer: {
    marginVertical: 1,
    flex:1,
    padding:10,
    alignItems:'center',
  },
  dataEntry:{
    flex:1,
    flexDirection:'row',
    marginTop:15,
    gap:5,

  },
  databox:{
    flex:1,
    textAlign:"center",
    alignItems:'center',
    height:100,
    justifyContent:'center',
    backgroundColor:'white',
    borderRadius:10,
  },
  name:{
    marginVertical:10
  },
  numbers:{
    fontSize:18,
    fontWeight:'bold',
    color: 'grey', 
    fontWeight: 'bold',
  },
  calendarContainer: {
    padding: 10,
    flex:1
  },
  addSignContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }], 
    borderRadius: 50, 
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex:1
  },
  addSign: {
    fontSize: 20,
    color: 'white', 
    fontWeight: 'bold',
  },
  filterContainer:{
    flexDirection:'row',
    borderWidth:1,
    borderColor:'grey',
    marginHorizontal:5,
  },
  filterButtons:{
    alignItems:'center',
    padding:7,
    flex:1,
  },
  datatitle:{
    fontSize:14
  }
});

export default HabitStats;
