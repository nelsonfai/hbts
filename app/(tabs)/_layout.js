import { Tabs, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { Text } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import I18nContext from "../../context/i18nProvider";
import { useContext } from "react";
const Layout = () => {
  const {i18n}= useContext(I18nContext)
  return (
<Tabs      
    screenOptions={({ route }) => ({
      headerShown: true,
      headerTitleAlign: 'center',
      headerTitleStyle: {
        alignSelf: 'center',
      },
      tabBarActiveTintColor: "black",
        tabBarStyle: [
         {   display: "flex",
            },
          null
        ],
      
      headerTitle: '',
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'home') {
          iconName = focused ? 'home' : 'home';
        } else if (route.name === 'settings') {
          iconName = focused ? 'cogs' : 'cogs';
        } else if (route.name === 'profile') {
          iconName = focused ? 'user' : 'user';
        } else if (route.name === 'partnershare') {
          iconName = focused ? 'heart' : 'heart';
        } else if (route.name === 'habits') {
          iconName = focused ? 'list-ul' : 'list-ul';
        } else if (route.name === '(habits)/AddHabit') {
          iconName = focused ? 'plus-circle' : 'plus-circle';
        }
        else if (route.name === 'notes') {
          iconName = focused ? 'sticky-note' : 'sticky-note';
        }
        return <FontAwesome name={iconName} size={size} color={focused ? 'black' : color} />;
      },
          })}


    initialRouteName="home"
  >
      <Tabs.Screen name="home" 
      options={{
            title:i18n.t('home.title'),
        }}
        />

      <Tabs.Screen name="habits"
            options={{
              title:i18n.t('habits.title')
          }} 
        />
              <Tabs.Screen name="notes"
            options={{
              title:i18n.t('notes.notes')
          }} 
        />
      <Tabs.Screen name="partnershare"
        options={{
          title:'Pairing',
                }} />
              <Tabs.Screen name="settings"
            options={{
              title:i18n.t('settings.title')
          }} />

    </Tabs>
  );
};

export default Layout;
