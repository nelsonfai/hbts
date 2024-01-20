import { SafeAreaView, ScrollView, View,Text,TouchableOpacity,StyleSheet,RefreshControl} from "react-native";
import { Stack, useRouter } from "expo-router";
import { COLORS,SIZES} from "../../constants";
import { useUser } from "../../context/userContext";
import ProfileImage from "../../components/common/Image";
import {Welcome} from "../../components";
import SharedLists from "../../components/home/popular/SharedList";
import I18nContext from "../../context/i18nProvider";
import { useContext, useState } from "react";
import SubscriptionModal from "../../components/subscription/SubcritionModal";
import Icon from 'react-native-vector-icons/FontAwesome';


const Home =  () => {
  const {user} = useUser()
  const router = useRouter();
  const {i18n} = useContext(I18nContext)
  const [showSubscriptionModal,setShowSubscriptionModal] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
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
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { 
          },
          headerShadowVisible: true,
          headerLeft: () =>(           
             <View style={{ padding: 15,marginBottom:10}}> 
            <ProfileImage
              mainImageUri={'https://i.ibb.co/N1TKLQn/Untitled-design-11-1.png'}
              width={35}
              height={35}
              name={user.name}
              handlePress={goToSettings}
            />
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

      <ScrollView showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }>
      <View style={styles.container}>
      <Welcome  user={user}   />

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
  
      </ScrollView>
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
          },
  subscriptionText: {
    fontSize: 16,
marginBottom: 8,
    textAlign:"center",    display:'none'

  },
  subscribeButton: {
    backgroundColor: 'black',
    backgroundColor:"#B0A7F7",
    padding: 10,
    borderRadius: 8,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    gap:5
  },
  subscribeButtonText: {
    color: '#FFF',
    color:'black',

    fontSize: 16,
  },
});
export default Home;
