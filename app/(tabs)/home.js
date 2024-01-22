import { SafeAreaView, ScrollView, View,Text,TouchableOpacity,StyleSheet,RefreshControl} from "react-native";
import { Stack, useRouter } from "expo-router";
import { COLORS,SIZES} from "../../constants";
import { useUser } from "../../context/userContext";
import ProfileImage from "../../components/common/Image";
import {Welcome} from "../../components";
import SharedLists from "../../components/home/popular/SharedList";
import I18nContext from "../../context/i18nProvider";
import { useContext, useEffect, useState } from "react";
import SubscriptionModal from "../../components/subscription/SubcritionModal";
import Icon from 'react-native-vector-icons/FontAwesome';
import NetInfo from '@react-native-community/netinfo';
import NetworkStatus from "../../components/NetworkStatus";

const Home =  () => {
  const {user} = useUser()
  const router = useRouter();
  const {i18n} = useContext(I18nContext)
  const [showSubscriptionModal,setShowSubscriptionModal] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const [network, setNetWork] = useState(true);
  const onRefresh = () => {

    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000); 
  };
const goToSettings = () => {
    router.push('settings');
  };
const onPressSubscribe = () => { 
  setShowSubscriptionModal(true)
}

const unsubscribe = NetInfo.addEventListener(state => {
  console.log('called')
  NetInfo.fetch().then(state => {
    setNetWork(state.isConnected)
  });
});

useEffect(() => {
  unsubscribe()
}, []);

return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerShown:false,
          headerStyle: { 
          },
          headerShadowVisible: true,
          headerLeft: () =>(           
             <View style={{ padding: 15,marginBottom:10,padding:0,marginLeft:10}}> 

            <Text style={{fontSize:22,fontWeight:500}}> Habts Us</Text>
          </View>)
          ,
          headerRight: () =>  (
            <View style={{ padding: 15,marginBottom:10}}> 
              <ProfileImage
                mainImageUri={user.profile_pic}
                width={35}
                height={35}
                name={user.name}
                handlePress={goToSettings}
              />
            </View>
          ),
          headerTitle: '',
        }}/> 

{ network ? (<ScrollView showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }>

      <View style={styles.container}>
      <Welcome  user={user} />
      {!user.premium ? (
    <View style={styles.subscriptionContainer}>
    <Text style={styles.subscriptionText}>
        {i18n.t('home.premiumText')}
        </Text>
        <TouchableOpacity onPress={onPressSubscribe} style={styles.subscribeButton}>
        <Icon name="star" size={25} color={'#ffdb83'} /> 
          <Text style={styles.subscribeButtonText}>
            {i18n.t('home.premiumButton')}
          </Text>
        </TouchableOpacity>
    </View>) : null}
      <SharedLists key={refreshing ? 'refreshed' : 'not-refreshed'} user_id={user.id} />

      </View>
  
      </ScrollView>) :<NetworkStatus/>}
      <SubscriptionModal isVisible={showSubscriptionModal} onClose={() => setShowSubscriptionModal(false)}/>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.medium,
    backgroundColor:'white'
  },
  sectionTitle: {
    marginBottom: 10,
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  createListButton: {
    alignItems: 'center',
    padding: 10,
    marginBottom: 16,
  },
  subscriptionContainer: {
        marginTop: 16,
        padding:15,
        borderRadius:10,
        backgroundColor:'#efedfd',
        backgroundColor:'#f5f4fd'

          },
  subscriptionText: {
    fontSize: 16,
  marginBottom: 10,
    textAlign:"center", 

  },
  subscribeButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 8,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    gap:5
  },
  subscribeButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});
export default Home;
